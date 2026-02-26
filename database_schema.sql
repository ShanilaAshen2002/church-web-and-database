-- ==========================================
-- ST FRANCIS XAVIER'S CHURCH - SUNDAY SCHOOL
-- DATABASE SCHEMA & SECURITY POLICIES
-- ==========================================

-- 1. Create Data Types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE grade_level AS ENUM ('preschool', 'grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6', 'grade_7', 'grade_8', 'grade_9', 'grade_10', 'grade_11');

-- 2. Profiles Table (extends InsForge/PostgreSQL auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    grade grade_level, -- Indicates class grade for students, and assigned grade for teachers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Notices Table (Notice Board)
CREATE TABLE notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 4. Calendar Events Table
CREATE TABLE calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- 5. Lectures Table (Teacher Shared Material)
CREATE TABLE lectures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT, -- Will store InsForge storage bucket URLs
    grade grade_level NOT NULL,
    teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;

-- 6. Attendance Table
CREATE TABLE attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    grade grade_level NOT NULL,
    status TEXT CHECK (status IN ('present', 'absent', 'late')),
    marked_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, date) -- Prevent marking the same student twice on same day
);
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Helper Function: Get Current User's Role
CREATE OR REPLACE FUNCTION get_user_role() RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper Function: Get Current User's Grade (for students)
CREATE OR REPLACE FUNCTION get_user_grade() RETURNS grade_level AS $$
  SELECT grade FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;


-- Profiles: Everyone can read. Only admins can edit everyone. Users can edit themselves.
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR get_user_role() = 'admin');
CREATE POLICY "Admin can delete profiles" ON profiles FOR DELETE USING (get_user_role() = 'admin');

-- Notices: Everyone can read. Only Admins/Teachers can create, update, delete.
CREATE POLICY "Notices are viewable by everyone" ON notices FOR SELECT USING (true);
CREATE POLICY "Admins and teachers modify notices" ON notices FOR ALL USING (get_user_role() IN ('admin', 'teacher'));

-- Calendar: Everyone can read. Only Admins/Teachers can create, update, delete.
CREATE POLICY "Calendar viewable by everyone" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "Admins and teachers modify calendar" ON calendar_events FOR ALL USING (get_user_role() IN ('admin', 'teacher'));

-- Lectures: Students see only lectures for their grade. Staff sees/modifies all.
CREATE POLICY "Students view own grade lectures, staff view all" ON lectures FOR SELECT USING (
    get_user_role() IN ('admin', 'teacher') OR 
    (get_user_role() = 'student' AND grade = get_user_grade())
);
CREATE POLICY "Staff modify lectures" ON lectures FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'teacher'));
CREATE POLICY "Staff modify lectures (update/delete)" ON lectures FOR UPDATE USING (get_user_role() IN ('admin', 'teacher'));
CREATE POLICY "Staff modify lectures (delete)" ON lectures FOR DELETE USING (get_user_role() IN ('admin', 'teacher'));

-- Attendance: Students see own attendance. Staff sees/modifies all.
CREATE POLICY "Students view own attendance, staff view all" ON attendance FOR SELECT USING (
    get_user_role() IN ('admin', 'teacher') OR 
    (get_user_role() = 'student' AND student_id = auth.uid())
);
CREATE POLICY "Staff modify attendance" ON attendance FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'teacher'));
CREATE POLICY "Staff update attendance" ON attendance FOR UPDATE USING (get_user_role() IN ('admin', 'teacher'));
CREATE POLICY "Staff delete attendance" ON attendance FOR DELETE USING (get_user_role() IN ('admin', 'teacher'));
