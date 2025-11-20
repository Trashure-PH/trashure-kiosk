import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { generateReceipt } from '../utils/receipt';

export const ReceiptScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { items, points } = location.state || { items: [], points: 0 };

    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (items.length > 0) {
            const receipt = generateReceipt(items, points);
            // Generate QR code as data URL with higher quality
            QRCode.toDataURL(receipt, {
                width: 450,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
                .then(url => setQrDataUrl(url))
                .catch(err => console.error('QR Code generation error:', err));
        }
    }, [items, points]);

    // Auto-redirect countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            navigate('/');
        }
    }, [countdown, navigate]);

    return (
        <div className="relative flex flex-col h-full w-full bg-gradient-to-br from-gray-900 via-black to-green-900 text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Confetti-like particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 bg-green-400/40 rounded-full animate-float-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${4 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="relative z-10 text-center py-10 animate-fade-in-up">
                <div className="inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.6)] animate-bounce-in">
                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
                    Success!
                </h1>
                <p className="text-2xl text-green-400 font-bold">
                    🎉 Thank you for recycling!
                </p>
            </div>

            {/* Main Content - Split Layout */}
            <div className="relative z-10 flex-1 grid grid-cols-2 gap-10 px-10 pb-4 min-h-0">

                {/* Left Side - Details */}
                <div className="flex flex-col gap-6 overflow-hidden">
                    {/* Points Display - Larger and more prominent */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border-2 border-white/30 shadow-2xl animate-fade-in-up">
                        <div className="text-center">
                            <div className="inline-block bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl px-12 py-10 shadow-[0_10px_50px_rgba(34,197,94,0.4)] transform hover:scale-105 transition-transform">
                                <div className="text-base text-green-100 uppercase tracking-[0.3em] mb-3 font-black">Points Earned</div>
                                <div className="text-8xl font-black text-white tracking-tight mb-2">{points}</div>
                                <div className="h-1 w-32 bg-white/30 rounded-full mx-auto mb-3"></div>
                                <div className="text-green-200 text-lg font-bold">{items.length} Item{items.length !== 1 ? 's' : ''} Recycled</div>
                            </div>
                        </div>
                    </div>

                    {/* Items Recycled */}
                    <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl animate-fade-in-up overflow-hidden flex flex-col" style={{ animationDelay: '0.1s' }}>
                        <h4 className="text-white font-black text-2xl mb-6 flex items-center gap-3">
                            <span className="text-3xl">♻️</span>
                            Recycled Items
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30">
                            <div className="flex flex-wrap gap-3">
                                {items.map((item: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="px-5 py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400/40 text-green-200 rounded-full text-base font-bold backdrop-blur-sm hover:scale-110 transition-transform shadow-lg"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - QR Code or Account Credit */}
                <div className="flex flex-col justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border-2 border-white/30 shadow-2xl w-full max-w-lg">
                        <div className="bg-white rounded-3xl p-10 shadow-xl">
                            {location.state?.user ? (
                                // Member View - Direct Credit
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                                        <span className="text-5xl">👤</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-800 mb-2">Account Credited!</h3>
                                    <p className="text-gray-500 text-lg font-medium mb-8">
                                        Points have been added to<br />
                                        <span className="text-green-600 font-bold">{location.state.user.displayName || 'your account'}</span>
                                    </p>

                                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 font-medium">Previous Balance</span>
                                            <span className="text-gray-800 font-bold">0 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-green-600 font-medium">Earned Now</span>
                                            <span className="text-green-600 font-bold">+{points} pts</span>
                                        </div>
                                        <div className="h-px bg-green-200 my-3"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-800 font-bold text-lg">New Balance</span>
                                            <span className="text-green-700 font-black text-xl">{points} pts</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 py-3 px-4 rounded-xl">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Transaction Saved</span>
                                    </div>
                                </div>
                            ) : (
                                // Guest View - QR Code
                                <>
                                    <div className="text-center mb-8">
                                        <h3 className="text-4xl font-black text-gray-800 mb-3">Scan to Claim</h3>
                                        <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4"></div>
                                        <p className="text-gray-600 text-lg font-medium">Use the Trashure app to redeem</p>
                                    </div>

                                    <div className="flex justify-center">
                                        {qrDataUrl ? (
                                            <div className="relative group">
                                                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition animate-pulse"></div>
                                                <img
                                                    src={qrDataUrl}
                                                    alt="Receipt QR Code"
                                                    className="relative w-96 h-96 rounded-2xl shadow-2xl"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-96 h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                <div className="text-gray-400 text-lg animate-pulse">Generating QR Code...</div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar with Timer & Action */}
            <div className="relative z-10 px-10 pb-8 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center relative">
                            <span className="font-bold text-lg">{countdown}</span>
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-green-500/20"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="text-green-500 transition-all duration-1000 ease-linear"
                                    strokeDasharray={`${(countdown / 30) * 100}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                            </svg>
                        </div>
                        <div className="text-gray-300 font-medium">
                            Auto-closing session in <span className="text-white font-bold">{countdown} seconds</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg px-8 py-3 rounded-xl border border-white/20 transition-all hover:scale-105 shadow-lg flex items-center gap-3"
                    >
                        <span>Start New Session Now</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
