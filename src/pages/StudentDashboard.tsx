import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'notices' | 'lectures' | 'attendance' | 'calendar'>('notices');
    const navigate = useNavigate();

    const handleSignOut = () => {
        navigate('/login');
    };

    const titles = {
        notices: 'Notice Board',
        lectures: 'My Lectures',
        attendance: 'Attendance Record',
        calendar: 'Church Calendar',
    };

    return (
        <div className="bg-gray-50 text-slate-800 font-sans min-h-screen flex selection:bg-church-purple selection:text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-church-purple text-white hidden md:flex flex-col shadow-xl">
                <div className="p-6 text-center border-b border-white/10">
                    <h2 className="text-2xl font-serif text-church-gold font-bold">Student Portal</h2>
                    <p className="text-sm mt-1 text-white/70">Grade 8</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {['notices', 'lectures', 'attendance', 'calendar'].map((section) => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section as any)}
                            className={`w-full text-left flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === section ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {titles[section as keyof typeof titles]}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10 text-center">
                    <button onClick={handleSignOut} className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">{titles[activeSection]}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">Hello, Sanjeewa</span>
                        <div className="h-10 w-10 bg-church-gold text-church-purple rounded-full flex items-center justify-center font-bold text-lg">S</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {activeSection === 'notices' && (
                        <section className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-church-gold hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-church-purple">Sunday School Reopening</h3>
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">Important</span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4">Posted by: Father Admin • Oct 12, 2026</p>
                                <p className="text-slate-700">Dear Students, Sunday school will officially resume next week following the annual feast. Please ensure you bring your new term books.</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-church-purple hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-church-purple">Choir Practice</h3>
                                </div>
                                <p className="text-slate-600 text-sm mb-4">Posted by: Teacher Malkanthi • Oct 10, 2026</p>
                                <p className="text-slate-700">A reminder that choir practice for Grade 8 students will be held this Saturday at 3:00 PM in the main hall.</p>
                            </div>
                        </section>
                    )}

                    {activeSection === 'lectures' && (
                        <section className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <h2 className="text-xl font-semibold mb-4 text-slate-700">Recent Materials for Grade 8</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">📘</div>
                                    <h3 className="text-lg font-bold text-slate-800">The Parables of Jesus</h3>
                                    <p className="text-sm text-slate-500 mb-4">Added 2 days ago</p>
                                    <button className="w-full py-2 bg-church-purple/10 text-church-purple rounded-lg font-semibold hover:bg-church-purple hover:text-white transition-colors">Download PDF</button>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">▶️</div>
                                    <h3 className="text-lg font-bold text-slate-800">History of the Church</h3>
                                    <p className="text-sm text-slate-500 mb-4">Added 1 week ago</p>
                                    <button className="w-full py-2 bg-church-purple/10 text-church-purple rounded-lg font-semibold hover:bg-church-purple hover:text-white transition-colors">Watch Video</button>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === 'attendance' && (
                        <section className="animate-[fadeIn_0.5s_ease-out]">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-lg text-slate-800">October 2026 Attendance</h3>
                                    <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">90% Present</span>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-slate-500 text-sm border-b border-gray-100">
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium">Status</th>
                                            <th className="p-4 font-medium">Marked By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        <tr><td className="p-4 text-slate-800">Sun, Oct 18</td><td className="p-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded font-semibold">Present</span></td><td className="p-4 text-slate-500">Teacher Malkanthi</td></tr>
                                        <tr><td className="p-4 text-slate-800">Sun, Oct 11</td><td className="p-4"><span className="text-red-600 bg-red-50 px-2 py-1 rounded font-semibold">Absent</span></td><td className="p-4 text-slate-500">Teacher Malkanthi</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeSection === 'calendar' && (
                        <section className="animate-[fadeIn_0.5s_ease-out]">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 font-serif">October Events</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row items-start border-l-2 border-church-gold pl-4 pb-4">
                                        <div className="w-16 flex-shrink-0 text-center mr-4 mb-2 sm:mb-0">
                                            <span className="block text-xs font-bold text-slate-400 uppercase">Oct</span>
                                            <span className="block text-2xl font-bold text-church-purple">25</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">Sunday School Exams</h4>
                                            <p className="text-sm text-slate-600 mt-1">End of term examinations for grades 1 through 11.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
