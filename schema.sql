DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS materials;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL, /* Student ID, Teacher ID, or 'admin' */
    password TEXT NOT NULL,
    role TEXT NOT NULL /* 'admin', 'staff', 'student' */
);

CREATE TABLE students (
    student_id TEXT PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL,
    age INTEGER,
    grade TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE staff (
    teacher_id TEXT PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES staff (teacher_id)
);

CREATE TABLE materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    grade TEXT,
    uploaded_by TEXT,
    FOREIGN KEY (uploaded_by) REFERENCES staff (teacher_id)
);

CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    date DATE NOT NULL,
    status TEXT NOT NULL, /* 'Present', 'Absent' */
    marked_by TEXT,
    UNIQUE(student_id, date),
    FOREIGN KEY (student_id) REFERENCES students (student_id),
    FOREIGN KEY (marked_by) REFERENCES staff (teacher_id)
);
