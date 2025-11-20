import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/userService';

export const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [showLoginInput, setShowLoginInput] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const user = await getUser(username);
            if (user) {
                navigate('/scan', { state: { user } });
            } else {
                setError('User not found. Try "demo"');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 via-black to-green-900 text-white p-8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl"></div>
            </div>

            {!showLoginInput ? (
                <div className="relative z-10 flex flex-col items-center animate-fade-in max-w-4xl w-full">
                    <h2 className="text-5xl font-black mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                        Choose Your Path
                    </h2>

                    <div className="flex flex-row gap-8 w-full justify-center">
                        {/* Account Option */}
                        <button
                            onClick={() => setShowLoginInput(true)}
                            className="group flex flex-col items-center justify-center w-80 h-96 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                        >
                            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-500/30 transition-colors">
                                <span className="text-5xl">👤</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-blue-400">Member</h3>
                            <p className="text-gray-400 text-center text-lg leading-relaxed">
                                Log in to earn points and track your impact.
                            </p>
                        </button>

                        {/* Guest Option */}
                        <button
                            onClick={() => navigate('/scan')}
                            className="group flex flex-col items-center justify-center w-80 h-96 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                        >
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 group-hover:bg-green-500/30 transition-colors">
                                <span className="text-5xl">🌱</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-green-400">Guest</h3>
                            <p className="text-gray-400 text-center text-lg leading-relaxed">
                                Start recycling immediately without an account.
                            </p>
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-16 text-gray-500 hover:text-white transition-colors text-lg font-medium flex items-center gap-2"
                    >
                        ← Back to Start
                    </button>
                </div>
            ) : (
                <div className="relative z-10 flex flex-col items-center w-full max-w-lg animate-fade-in bg-black/40 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">👋</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400 mb-8 text-center">Enter your username to continue</p>

                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full p-5 rounded-2xl bg-white/5 text-white text-xl border border-white/10 focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition active:scale-95 mt-2"
                        >
                            {isLoading ? 'Verifying...' : 'Continue'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 w-full text-red-400 text-center font-medium bg-red-900/20 px-4 py-3 rounded-xl border border-red-500/20 animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setShowLoginInput(false);
                            setError(null);
                            setUsername('');
                        }}
                        className="mt-8 text-gray-500 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};
