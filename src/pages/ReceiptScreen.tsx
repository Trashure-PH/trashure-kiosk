import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { generateReceipt } from '../utils/receipt';

export const ReceiptScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { items, points } = location.state || { items: [], points: 0 };

    const [qrDataUrl, setQrDataUrl] = useState<string>('');

    useEffect(() => {
        if (items.length > 0) {
            const receipt = generateReceipt(items, points);
            // Generate QR code as data URL with higher quality
            QRCode.toDataURL(receipt, {
                width: 400,
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

    return (
        <div className="relative flex flex-col h-full w-full bg-gradient-to-br from-gray-900 via-black to-green-900 text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center py-8 animate-fade-in-up">
                <div className="inline-block mb-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)] animate-bounce-in">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                    Session Complete!
                </h1>
                <p className="text-xl text-green-400 font-medium">
                    🎉 Great job recycling!
                </p>
            </div>

            {/* Main Content - Split Layout */}
            <div className="relative z-10 flex-1 grid grid-cols-2 gap-8 px-8 pb-8 min-h-0">

                {/* Left Side - Details */}
                <div className="flex flex-col gap-6 overflow-hidden">
                    {/* Points Display */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-fade-in-up">
                        <div className="text-center">
                            <div className="inline-block bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl px-8 py-6 shadow-lg transform hover:scale-105 transition-transform">
                                <div className="text-sm text-green-100 uppercase tracking-widest mb-2 font-bold">Total Points Earned</div>
                                <div className="text-7xl font-black text-white tracking-tight">{points}</div>
                                <div className="text-green-200 text-sm mt-2 font-medium">{items.length} item{items.length !== 1 ? 's' : ''} recycled</div>
                            </div>
                        </div>
                    </div>

                    {/* Items Recycled */}
                    <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl animate-fade-in-up overflow-hidden flex flex-col" style={{ animationDelay: '0.1s' }}>
                        <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="text-2xl">♻️</span>
                            Items Recycled
                        </h4>
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                            <div className="flex flex-wrap gap-2">
                                {items.map((item: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300 rounded-full text-sm font-medium backdrop-blur-sm hover:scale-105 transition-transform"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full group bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-lg px-8 py-4 rounded-2xl border border-white/20 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Start New Session
                        </button>
                    </div>
                </div>

                {/* Right Side - QR Code */}
                <div className="flex flex-col justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            <div className="text-center mb-6">
                                <h3 className="text-3xl font-bold text-gray-800 mb-2">Scan to Claim</h3>
                                <p className="text-gray-500 text-base">Use the Trashure app to redeem your points</p>
                            </div>

                            <div className="flex justify-center">
                                {qrDataUrl ? (
                                    <div className="relative group">
                                        <div className="absolute -inset-3 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
                                        <img
                                            src={qrDataUrl}
                                            alt="Receipt QR Code"
                                            className="relative w-80 h-80 rounded-xl"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-80 h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <div className="text-gray-400 animate-pulse">Generating QR Code...</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
