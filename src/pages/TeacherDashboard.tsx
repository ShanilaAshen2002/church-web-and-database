import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'attendance' | 'lectures' | 'notices' | 'students'>('attendance');
    const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userRole = params.get('role');
        if (userRole === 'admin') setRole('admin');
    }, [location]);

    const handleSignOut = () => {
        navigate('/login');
    };

    const menuItems = [
        { id: 'attendance', label: 'Mark Attendance' },
        { id: 'lectures', label: 'Manage Lectures' },
        { id: 'notices', label: 'Manage Notices' },
        { id: 'students', label: 'Manage Students & Staff (Admin)', adminOnly: true }
    ];

    const titles: Record<string, string> = {
        attendance: 'Mark Attendance',
        lectures: 'Manage Lectures',
        notices: 'Manage Notices',
        students: 'Admin: Management',
    };

    return (
        <div className="bg-slate-100 text-slate-800 font-sans min-h-screen flex selection:bg-church-purple selection:text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e293b] text-white flex flex-col shadow-xl hidden md:flex">
                <div className="p-6 text-center border-b border-white/10">
                    <h2 className="text-2xl font-serif text-church-gold font-bold">Staff Portal</h2>
                    <p className="text-sm mt-1 text-white/50">Role: {role === 'admin' ? 'Administrator' : 'Teacher'}</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.filter(item => !item.adminOnly || role === 'admin').map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as any)}
                            className={`w-full text-left flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10 text-center">
                    <div className={`p-2 rounded w-full border font-semibold text-sm mb-4 ${role === 'admin' ? 'bg-red-900 border-red-500 text-white' : 'bg-[#0f172a] border-gray-600 text-white'}`}>
                        Access Level: {role === 'admin' ? 'Admin' : 'Teacher'}
                    </div>
                    <button onClick={handleSignOut} className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center z-10">
                    <h1 className="text-2xl font-bold text-slate-800">{titles[activeSection]}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">Hello, {role === 'admin' ? 'Father Admin' : 'Teacher Malkanthi'}</span>
                        <div className={`h-10 w-10 text-white rounded-full flex items-center justify-center font-bold text-lg ${role === 'admin' ? 'bg-red-800' : 'bg-church-purple'}`}>
                            {role === 'admin' ? 'A' : 'M'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    {activeSection === 'attendance' && (
                        <section className="space-y-6 max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Attendance Sheet</h2>
                                        <p className="text-slate-500 text-sm">Select Grade and Date to mark attendance</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <input type="date" defaultValue="2026-10-18" className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-church-purple" />
                                        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-church-purple">
                                            <option>Grade 8</option>
                                            {role === 'admin' && <option>Grade 9</option>}
                                        </select>
                                        <button className="bg-church-purple text-white px-6 py-2 rounded-lg text-sm font-semibold shadow hover:bg-church-violet transition-colors">Load Roster</button>
                                    </div>
                                </div>

                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-slate-500 text-sm border-y border-gray-200">
                                            <th className="p-4 font-medium">Student Name</th>
                                            <th className="p-4 font-medium">Email / ID</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        <tr className="hover:bg-gray-50/50">
                                            <td className="p-4 font-semibold text-slate-800">Sanjeewa Perera</td>
                                            <td className="p-4 text-slate-500">STU0001</td>
                                            <td className="p-4">
                                                <select className="border border-gray-300 rounded px-2 py-1 outline-none text-green-700 bg-green-50 focus:ring-2 focus:ring-church-gold" defaultValue="present">
                                                    <option value="present">Present</option>
                                                    <option value="absent">Absent</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-6 flex justify-end">
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">Save Attendance</button>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === 'lectures' && (
                        <section className="space-y-6 max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Lecture Material</h2>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-1">Title</label>
                                            <input type="text" placeholder="e.g. Parables of Jesus" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-church-purple" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1">Upload File</label>
                                        <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-church-purple/10 file:text-church-purple" />
                                    </div>
                                    <button type="button" onClick={() => alert('Mock: Uploaded')} className="bg-church-purple text-white px-6 py-2 rounded-lg font-bold">Publish Material</button>
                                </form>
                            </div>
                        </section>
                    )}

                    {activeSection === 'notices' && (
                        <section className="space-y-6 max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Post a Notice</h2>
                                <form className="space-y-4">
                                    <input type="text" placeholder="Notice Title" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-church-purple" />
                                    <textarea rows={4} placeholder="Content" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-church-purple"></textarea>
                                    <button type="button" onClick={() => alert('Mock: Posted')} className="bg-church-gold text-church-violet px-6 py-2 rounded-lg font-bold">Post to Notice Board</button>
                                </form>
                            </div>
                        </section>
                    )}

                    {activeSection === 'students' && role === 'admin' && (
                        <section className="space-y-6 max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                            <div className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm">
                                <h2 className="text-xl font-bold text-red-800 mb-2">Admin Dashboard Panel</h2>
                                <p className="text-red-600 text-sm mb-6">Restricted to administrators. Add/remove users.</p>
                                <div className="flex gap-4">
                                    <button className="bg-white border-2 border-slate-300 hover:border-church-purple text-slate-700 font-bold px-6 py-3 rounded-xl shadow-sm transition-colors flex-1">+ Register New Teacher</button>
                                    <button className="bg-white border-2 border-slate-300 hover:border-church-purple text-slate-700 font-bold px-6 py-3 rounded-xl shadow-sm transition-colors flex-1">+ Register New Student</button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
