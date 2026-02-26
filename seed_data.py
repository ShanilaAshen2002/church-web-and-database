import sqlite3
from werkzeug.security import generate_password_hash
import sys

DATABASE_FILE = 'database.db'

def seed_data():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    print("Seeding database with sample users...")

    # Data to be inserted
    staff_data = [
        ('S001', 'John Doe', 'password123'),
        ('S002', 'Jane Smith', 'password123')
    ]

    student_data = [
        ('STU001', 'Alice Johnson', 15, '10th', 'pass123'),
        ('STU002', 'Bob Williams', 16, '11th', 'pass123'),
        ('STU003', 'Charlie Brown', 15, '10th', 'pass123')
    ]

    try:
        # Insert Staff
        for teacher_id, name, password in staff_data:
            hashed_pw = generate_password_hash(password)
            cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, 'staff')", (teacher_id, hashed_pw))
            user_id = cursor.lastrowid
            cursor.execute("INSERT INTO staff (teacher_id, user_id, name) VALUES (?, ?, ?)", (teacher_id, user_id, name))
            print(f"Added Staff: {name} ({teacher_id})")

        # Insert Students
        for student_id, name, age, grade, password in student_data:
            hashed_pw = generate_password_hash(password)
            cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, 'student')", (student_id, hashed_pw))
            user_id = cursor.lastrowid
            cursor.execute("INSERT INTO students (student_id, user_id, name, age, grade) VALUES (?, ?, ?, ?, ?)", (student_id, user_id, name, age, grade))
            print(f"Added Student: {name} ({student_id} - Grade {grade})")

        conn.commit()
        print("\nSuccessfully seeded demo data.")
        print("Login with Staff IDs: S001, S002 (Password: password123)")
        print("Login with Student IDs: STU001, STU002, STU003 (Password: pass123)")
    except Exception as e:
        print(f"Error seeding data: {e}. (Run init_db.py first if it hasn't run or delete database.db and run init_db.py to start fresh)")
    finally:
        conn.close()

if __name__ == '__main__':
    seed_data()
