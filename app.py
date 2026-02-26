from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import sqlite3
import os
import uuid

app = Flask(__name__)
# Enable CORS for all origins
CORS(app)

DATABASE = 'database.db'
active_sessions = {}

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Authentication Decorators
def get_token_from_header():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]
    return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = get_token_from_header()
        if not token or token not in active_sessions:
            return jsonify({'error': 'Unauthorized'}), 401
        request.user_session = active_sessions[token]
        request.token = token
        return f(*args, **kwargs)
    return decorated_function

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = get_token_from_header()
            if not token or token not in active_sessions:
                return jsonify({'error': 'Forbidden access'}), 403
            user_session = active_sessions[token]
            if user_session.get('role') != role and user_session.get('role') != 'admin': # Admin can access staff routes
                return jsonify({'error': 'Forbidden access'}), 403
            request.user_session = user_session
            request.token = token
            return f(*args, **kwargs)
        return decorated_function
    return decorator


# --- AUTH ROUTES ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password'], password):
        token = str(uuid.uuid4())
        active_sessions[token] = {
            'user_id': user['id'],
            'username': user['username'],
            'role': user['role']
        }
        
        return jsonify({
            'message': 'Logged in successfully',
            'token': token,
            'role': user['role'],
            'username': user['username']
        })
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    active_sessions.pop(request.token, None)
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/me', methods=['GET'])
@login_required
def get_me():
    return jsonify({
        'user_id': request.user_session['user_id'],
        'username': request.user_session['username'],
        'role': request.user_session['role']
    })


# --- ADMIN PIPELINE ---
@app.route('/api/admin/students', methods=['GET'])
@role_required('admin')
def get_all_students():
    conn = get_db()
    students = conn.execute("SELECT student_id, name, age, grade FROM students").fetchall()
    conn.close()
    return jsonify([dict(s) for s in students])

@app.route('/api/admin/students', methods=['POST'])
@role_required('admin')
def add_student():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    try:
        hashed_pw = generate_password_hash(data['password'])
        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, 'student')", (data['username'], hashed_pw))
        user_id = cursor.lastrowid
        cursor.execute("INSERT INTO students (student_id, user_id, name, age, grade) VALUES (?, ?, ?, ?, ?)",
                       (data['username'], user_id, data['name'], data['age'], data['grade']))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Student ID already exists.'}), 400
    finally:
        conn.close()
    return jsonify({'message': 'Student added successfully'})

@app.route('/api/admin/students/<student_id>', methods=['DELETE'])
@role_required('admin')
def delete_student(student_id):
    conn = get_db()
    cursor = conn.cursor()
    student = cursor.execute("SELECT user_id FROM students WHERE student_id = ?", (student_id,)).fetchone()
    if student:
        cursor.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
        cursor.execute("DELETE FROM users WHERE id = ?", (student['user_id'],))
        conn.commit()
    conn.close()
    return jsonify({'message': 'Student deleted successfully'})

@app.route('/api/admin/staff', methods=['GET'])
@role_required('admin')
def get_all_staff():
    conn = get_db()
    staff = conn.execute("SELECT teacher_id, name FROM staff").fetchall()
    conn.close()
    return jsonify([dict(s) for s in staff])

@app.route('/api/admin/staff', methods=['POST'])
@role_required('admin')
def add_staff():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    try:
        hashed_pw = generate_password_hash(data['password'])
        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, 'staff')", (data['username'], hashed_pw))
        user_id = cursor.lastrowid
        cursor.execute("INSERT INTO staff (teacher_id, user_id, name) VALUES (?, ?, ?)",
                       (data['username'], user_id, data['name']))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Teacher ID/Username already exists.'}), 400
    finally:
        conn.close()
    return jsonify({'message': 'Staff added successfully'})

@app.route('/api/admin/staff/<teacher_id>', methods=['DELETE'])
@role_required('admin')
def delete_staff(teacher_id):
    conn = get_db()
    cursor = conn.cursor()
    staff = cursor.execute("SELECT user_id FROM staff WHERE teacher_id = ?", (teacher_id,)).fetchone()
    if staff:
        cursor.execute("DELETE FROM staff WHERE teacher_id = ?", (teacher_id,))
        cursor.execute("DELETE FROM users WHERE id = ?", (staff['user_id'],))
        conn.commit()
    conn.close()
    return jsonify({'message': 'Staff deleted successfully'})


# --- STAFF (TEACHERS) ---
@app.route('/api/staff/attendance', methods=['POST'])
@role_required('staff')
def mark_attendance():
    data = request.json
    teacher_id = request.user_session['username']
    conn = get_db()
    try:
        conn.execute("INSERT OR REPLACE INTO attendance (student_id, date, status, marked_by) VALUES (?, ?, ?, ?)",
                     (data['student_id'], data['date'], data['status'], teacher_id))
        conn.commit()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()
    return jsonify({'message': 'Attendance marked successfully'})

@app.route('/api/staff/notices', methods=['POST'])
@role_required('staff')
def post_notice():
    data = request.json
    teacher_id = request.user_session['username']
    conn = get_db()
    conn.execute("INSERT INTO notices (title, content, created_by) VALUES (?, ?, ?)",
                 (data['title'], data['content'], teacher_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Notice posted successfully'})

@app.route('/api/staff/materials', methods=['POST'])
@role_required('staff')
def upload_material():
    data = request.json
    teacher_id = request.user_session['username']
    conn = get_db()
    conn.execute("INSERT INTO materials (title, file_path, grade, uploaded_by) VALUES (?, ?, ?, ?)",
                 (data['title'], data['file_path'], data['grade'], teacher_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Material pointer saved successfully'})


# --- SYSTEM (ALL AUTHORIZED / STUDENTS) ---
@app.route('/api/notices', methods=['GET'])
@login_required
def get_notices():
    conn = get_db()
    notices = conn.execute("SELECT * FROM notices ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(n) for n in notices])

@app.route('/api/student/attendance', methods=['GET'])
@role_required('student')
def get_student_attendance():
    student_id = request.user_session['username']
    conn = get_db()
    records = conn.execute("SELECT date, status, marked_by FROM attendance WHERE student_id = ? ORDER BY date DESC", (student_id,)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in records])

@app.route('/api/student/materials', methods=['GET'])
@role_required('student')
def get_student_materials():
    student_id = request.user_session['username']
    conn = get_db()
    student = conn.execute("SELECT grade FROM students WHERE student_id = ?", (student_id,)).fetchone()
    if not student:
        conn.close()
        return jsonify({'error': 'Student details not found'}), 404
    materials = conn.execute("SELECT * FROM materials WHERE grade = ?", (student['grade'],)).fetchall()
    conn.close()
    return jsonify([dict(m) for m in materials])


# --- CALENDAR ---
@app.route('/api/calendar', methods=['GET'])
@login_required
def get_calendar_events():
    conn = get_db()
    events = conn.execute("SELECT id, event_date, title, created_by FROM calendar_events ORDER BY event_date ASC").fetchall()
    conn.close()
    return jsonify([dict(e) for e in events])

@app.route('/api/staff/calendar', methods=['POST'])
@role_required('staff')
def add_calendar_event():
    data = request.json
    teacher_id = request.user_session['username']
    conn = get_db()
    conn.execute("INSERT INTO calendar_events (event_date, title, created_by) VALUES (?, ?, ?)",
                 (data['event_date'], data['title'], teacher_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Calendar event added successfully'})

@app.route('/api/staff/calendar/<int:event_id>', methods=['DELETE'])
@role_required('staff')
def delete_calendar_event(event_id):
    conn = get_db()
    conn.execute("DELETE FROM calendar_events WHERE id = ?", (event_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Calendar event deleted successfully'})


if __name__ == '__main__':
    # Makes server available locally
    app.run(debug=True, port=5000)
