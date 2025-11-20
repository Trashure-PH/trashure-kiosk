import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AttractScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate('/login')}
            className="relative flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-green-900 via-black to-emerald-900 text-white p-8 text-center cursor-pointer overflow-hidden"
        >
            {/* Animated particles background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-float-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Animated gradient orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Main content */}
            <div className="relative z-10">
                {/* Animated recycling icon */}
                <div className="mb-8 animate-bounce-slow">
                    <span className="text-[12rem] drop-shadow-[0_0_50px_rgba(34,197,94,0.6)] inline-block animate-spin-slow">♻️</span>
                </div>

                {/* Animated title with wave effect */}
                <h1 className="text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 animate-fade-in-up">
                    <span className="inline-block animate-wave" style={{ animationDelay: '0s' }}>T</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.05s' }}>r</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.1s' }}>a</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.15s' }}>s</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.2s' }}>h</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.25s' }}>u</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.3s' }}>r</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.35s' }}>e</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.4s' }}>&nbsp;</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.45s' }}>K</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.5s' }}>i</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.55s' }}>o</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.6s' }}>s</span>
                    <span className="inline-block animate-wave" style={{ animationDelay: '0.65s' }}>k</span>
                </h1>

                {/* Animated description */}
                <p className="text-3xl mb-16 text-gray-300 max-w-3xl leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    Deposit your recyclables into the kiosk and earn points instantly!
                </p>

                {/* Call to action - Simple semi-transparent text */}
                <div className="animate-fade-in-up mt-8" style={{ animationDelay: '1s' }}>
                    <div className="text-2xl text-white/60 font-light text-center animate-pulse">
                        Touch anywhere to begin
                    </div>
                </div>
            </div>
        </div>
    );
};
