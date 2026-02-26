import sqlite3
import os
from werkzeug.security import generate_password_hash

DATABASE_FILE = 'database.db'
SCHEMA_FILE = 'schema.sql'

def init_db():
    if os.path.exists(DATABASE_FILE):
        os.remove(DATABASE_FILE)
        
    conn = sqlite3.connect(DATABASE_FILE)
    
    # Run schema script
    with open(SCHEMA_FILE, 'r') as f:
        conn.executescript(f.read())
        
    # Create default Admin
    cur = conn.cursor()
    admin_password = generate_password_hash('admin123')
    cur.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ('admin', admin_password, 'admin')
    )
    
    print("Database initialized successfully!")
    print("Default Admin user created. Username: 'admin', Password: 'admin123'")
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
