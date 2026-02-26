import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            setIsDarkMode(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <div className="font-sans antialiased text-church-violet dark:text-gray-100 bg-church-cream dark:bg-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center min-w-0">
                            <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0">
                                <img src="/Events/Cover photos/logo.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-church-gold/20 shadow-sm" />
                                <span className="font-serif text-base sm:text-lg md:text-2xl font-bold text-church-purple tracking-tight truncate">
                                    St. Francis Xavier's Church
                                </span>
                            </a>
                        </div>
                        <div className="hidden md:flex space-x-8 items-center">
                            <a href="#home" className="text-slate-600 dark:text-slate-300 hover:text-church-purple font-medium">Home</a>
                            <a href="#mass-schedule" className="text-slate-600 dark:text-slate-300 hover:text-church-purple font-medium">Mass Schedule</a>
                            <Link to="/login" className="px-5 py-2.5 border-2 border-church-purple text-church-purple dark:border-church-gold dark:text-church-gold rounded-full font-bold hover:bg-church-purple hover:text-white transition-colors">
                                Portal Login
                            </Link>
                            <button onClick={toggleTheme} className="text-church-purple dark:text-church-gold rounded-full p-2.5 focus:outline-none">
                                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                            </button>
                        </div>
                        <div className="md:hidden flex items-center gap-1">
                            <button onClick={toggleTheme} className="text-church-purple dark:text-church-gold p-2">
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-church-purple dark:text-church-gold p-2">
                                ☰
                            </button>
                        </div>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white/95 dark:bg-slate-900/95 absolute w-full shadow-lg px-4 pt-2 pb-6 space-y-2">
                        <a href="#home" className="block px-3 py-3 rounded-lg text-slate-700 dark:text-slate-200">Home</a>
                        <a href="#mass-schedule" className="block px-3 py-3 rounded-lg text-slate-700 dark:text-slate-200">Mass Schedule</a>
                        <Link to="/login" className="block px-3 py-3 text-center rounded-lg font-bold border-2 border-church-purple text-church-purple">
                            Portal Login
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/Events/Cover photos/new-church.jpg" alt="Church" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-church-purple/50 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-church-purple/80 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-[fadeInUp_1s_ease-out]">
                        St. Francis Xavier's Church
                    </h1>
                    <p className="text-2xl md:text-3xl text-church-gold mb-4 font-medium animate-[fadeInUp_1s_ease-out]">
                        Angulana
                    </p>
                    <div className="flex justify-center mt-10">
                        <a href="#mass-schedule" className="px-10 py-4 bg-church-gold text-church-violet font-bold text-lg rounded-full shadow-lg hover:bg-yellow-400">
                            Mass Times
                        </a>
                    </div>
                </div>
            </header>

            {/* Mass Schedule */}
            <section id="mass-schedule" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-church-purple dark:text-church-gold mb-4">Mass Schedule</h2>
                        <div className="w-24 h-1 bg-church-gold mx-auto"></div>
                    </div>
                    <div className="overflow-hidden bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-church-purple/10">
                        <table className="min-w-full text-center">
                            <thead className="bg-church-gold text-church-violet">
                                <tr>
                                    <th scope="col" className="py-4 px-6 text-lg font-bold">Day</th>
                                    <th scope="col" className="py-4 px-6 text-lg font-bold">Time</th>
                                    <th scope="col" className="py-4 px-6 text-lg font-bold">Language</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-church-purple/10">
                                <tr className="hover:bg-church-cream/50">
                                    <td className="py-4 px-6 font-medium text-church-purple">Sunday</td>
                                    <td className="py-4 px-6">8:30 AM</td>
                                    <td className="py-4 px-6">Sinhala</td>
                                </tr>
                                <tr className="bg-church-cream/30 dark:bg-slate-700/30">
                                    <td className="py-4 px-6 font-medium text-church-purple">Tuesday</td>
                                    <td className="py-4 px-6">6:30 PM</td>
                                    <td className="py-4 px-6">Sinhala</td>
                                </tr>
                                <tr className="hover:bg-church-cream/50">
                                    <td className="py-4 px-6 font-medium text-church-purple">Thursday</td>
                                    <td className="py-4 px-6">6:30 PM</td>
                                    <td className="py-4 px-6">Sinhala</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-church-purple dark:bg-slate-950 text-white py-12 text-center">
                <p className="text-slate-400 text-sm">&copy; 2026 St. Francis Xavier's Church, Angulana. All rights reserved.</p>
                <div className="mt-2 text-church-gold text-sm font-serif italic">Ad Majorem Dei Gloriam</div>
            </footer>
        </div>
    );
};

export default Home;
