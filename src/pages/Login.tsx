import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const uname = username.trim().toUpperCase();
            let actualRole = role;

            if (role === 'teacher') {
                if (uname.startsWith('ADMIN')) {
                    actualRole = 'admin';
                } else if (uname.startsWith('TEACH')) {
                    actualRole = 'teacher';
                } else {
                    throw new Error("Invalid username for Teacher / Admin portal. Use TEACH... or ADMIN...");
                }
            } else if (role === 'student') {
                if (!uname.startsWith('STU')) {
                    throw new Error("Invalid username for Student portal. Must start with STU");
                }
                actualRole = 'student';
            }

            // Simulate InsForge API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`Demo mode: Authenticating as ${actualRole} with ${uname}`);

            if (actualRole === 'admin') {
                navigate('/teacher-dashboard?role=admin');
            } else if (actualRole === 'teacher') {
                navigate('/teacher-dashboard?role=teacher');
            } else {
                navigate('/student-dashboard');
            }

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex w-full min-h-screen selection:bg-church-purple selection:text-white">
            {/* Left Banner */}
            <div className="hidden lg:flex w-1/2 relative bg-church-purple/20 overflow-hidden items-center justify-center isolate">
                <img src="/Events/Cover photos/new-church.jpg" alt="Church" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-church-purple/70 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-church-purple/90 via-transparent to-church-violet/90"></div>
                <div className="relative z-10 p-12 text-center max-w-lg animate-[slideUp_0.6s_ease-out]">
                    <img src="/Events/Cover photos/logo.png" alt="Logo" className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-church-gold/30 shadow-2xl" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Welcome to the<br /><span className="text-church-gold">Sunday School Portal</span>
                    </h1>
                    <p className="text-lg text-church-cream/90 font-light leading-relaxed mb-8">
                        St. Francis Xavier's Church, Angulana.<br />Empowering our students and equipping our teachers for a brighter future in faith.
                    </p>
                </div>
            </div>

            {/* Right Login Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50 dark:bg-slate-900">
                <div className="w-full max-w-md relative z-10 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700">

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">Sign In</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Please enter your credentials to access your account.</p>
                    </div>

                    <div className="flex p-1 space-x-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl mb-8">
                        <button
                            onClick={() => setRole('student')}
                            className={`w-1/2 py-2.5 text-sm font-semibold rounded-lg shadow transition-all ${role === 'student' ? 'bg-white dark:bg-slate-600 text-church-purple dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                            Student
                        </button>
                        <button
                            onClick={() => setRole('teacher')}
                            className={`w-1/2 py-2.5 text-sm font-semibold rounded-lg shadow transition-all ${role === 'teacher' ? 'bg-white dark:bg-slate-600 text-church-purple dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                            Teacher / Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <span className="font-medium">Error!</span> <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Username (STU.../TEACH.../ADMIN...)</label>
                            <div className="relative">
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="e.g. STU0001, TEACH001, ADMIN01"
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-church-purple outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                                    className="w-full pr-12 px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-church-purple outline-none" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 bg-church-purple hover:bg-church-violet text-white font-semibold rounded-xl shadow-md transition-all duration-200">
                            {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
                        </button>
                    </form>

                </div>
            </div>
        </main>
    );
};

export default Login;
