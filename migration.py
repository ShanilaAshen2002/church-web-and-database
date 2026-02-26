import sqlite3

def run_migration():
    conn = sqlite3.connect('database.db')
    try:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS calendar_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_date DATE NOT NULL,
            title TEXT NOT NULL,
            created_by TEXT,
            FOREIGN KEY (created_by) REFERENCES staff (teacher_id)
        );
        """)
        
        # Insert the requested sample event if it doesn't exist
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM calendar_events WHERE title = ?", ('Feast of St. Sebastian',))
        if cursor.fetchone()[0] == 0:
            cursor.execute("INSERT INTO calendar_events (event_date, title, created_by) VALUES (?, ?, ?)", 
                           ('2026-02-24', 'Feast of St. Sebastian', 'S001'))
            
        conn.commit()
        print("Migration completed.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    run_migration()
