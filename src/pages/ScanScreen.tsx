import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scanner, type ScannerRef } from '../components/scanner/Scanner';
import { useIdleReset } from '../hooks/useIdleReset';

export const ScanScreen: React.FC = () => {
    const { getRemainingTime, reset } = useIdleReset(60000); // 60 seconds timeout for scanning
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const [sessionItems, setSessionItems] = useState<string[]>([]);
    const [sessionPoints, setSessionPoints] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [scanMessage, setScanMessage] = useState('');
    const scannerRef = useRef<ScannerRef>(null);
    const [remainingTime, setRemainingTime] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(Math.ceil(getRemainingTime() / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [getRemainingTime]);

    const handleScan = (item: string) => {
        reset(); // Reset idle timer on successful scan
        setSessionItems(prev => [...prev, item]);
        setSessionPoints(prev => prev + 10);
        setIsScanning(false);
        setScanMessage('');
    };

    const handleManualScan = () => {
        console.log('🔘 Add Item button clicked');
        reset(); // Reset idle timer when starting scan
        setIsScanning(true);
        setScanMessage('');

        if (scannerRef.current) {
            scannerRef.current.forceDetect();
            // Show "no item" message after 2 seconds if nothing detected
            setTimeout(() => {
                setIsScanning(false);
                setScanMessage('❌ No item detected');
                setTimeout(() => setScanMessage(''), 2000);
            }, 2000);
        } else {
            console.error('❌ Scanner ref is null!');
            setIsScanning(false);
            setScanMessage('❌ Scanner not ready');
            setTimeout(() => setScanMessage(''), 2000);
        }
    };

    const handleFinish = () => {
        navigate('/receipt', { state: { items: sessionItems, points: sessionPoints, user } });
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-green-900 text-white p-8 flex flex-col relative">
            {/* Idle Timer Indicator */}
            <div className="absolute top-8 right-8 z-50 animate-fade-in">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-white/10"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-green-500 transition-all duration-1000 ease-linear"
                                strokeDasharray={`${(remainingTime / 60) * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <span className="text-sm font-bold">{remainingTime}</span>
                    </div>
                    <span className="text-sm text-gray-400 font-medium pr-1">Auto-reset</span>
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8 pl-20"> {/* Added padding-left to make room for back button if needed, though back button is absolute */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">♻️</div>
                    <div>
                        <h1 className="text-2xl font-bold">Recycling Session</h1>
                        <p className="text-gray-400 text-sm">
                            {user ? `Welcome, ${user.displayName || 'Member'}` : 'Guest User'}
                        </p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 mr-32"> {/* Added margin-right to avoid overlap with timer */}
                    <span className="text-green-400 font-bold">{sessionItems.length}</span> items scanned
                </div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 transition-all hover:scale-110 group"
                title="Go Back"
            >
                <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">

                {/* Left Panel: Stats & Instructions */}
                <div className="col-span-4 flex flex-col gap-6">
                    {/* Points Card */}
                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-green-100 font-medium text-lg mb-2">Session Points</h3>
                        <div className="text-6xl font-black text-white tracking-tight">{sessionPoints}</div>
                        <div className="mt-4 text-green-200 text-sm font-medium flex items-center gap-2">
                            <span className="bg-white/20 p-1 rounded text-xs">INFO</span>
                            +10 points per item
                        </div>
                    </div>

                    {/* Recent Items List */}
                    <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col overflow-hidden">
                        <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-4">Recent Items</h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20 max-h-[400px]">
                            {sessionItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center opacity-60">
                                    <div className="text-4xl mb-2">📥</div>
                                    <p>No items scanned yet</p>
                                </div>
                            ) : (
                                [...sessionItems].reverse().map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-xl animate-fade-in-up">
                                        <span className="capitalize font-medium">{item}</span>
                                        <span className="text-green-400 font-bold">+10</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Camera Viewport */}
                <div className="col-span-8 flex flex-col">
                    <div className="flex-1 relative bg-black rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                        <Scanner ref={scannerRef} onScan={handleScan} />

                        {/* Notification Toast */}
                        {scanMessage && (
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in-up">
                                <div className="bg-red-600/90 backdrop-blur-xl px-8 py-4 rounded-2xl border border-red-400/30 shadow-2xl">
                                    <div className="text-xl text-white font-bold">{scanMessage}</div>
                                </div>
                            </div>
                        )}

                        {/* Corner Accents */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-green-500/50 rounded-tl-xl pointer-events-none"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-green-500/50 rounded-tr-xl pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-green-500/50 rounded-bl-xl pointer-events-none"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-green-500/50 rounded-br-xl pointer-events-none"></div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex justify-between items-center">
                        {/* Scan Button */}
                        <button
                            onClick={handleManualScan}
                            disabled={isScanning}
                            className={`text-white text-lg font-bold py-4 px-8 rounded-2xl transform transition shadow-lg flex items-center gap-3 ${isScanning
                                ? 'bg-yellow-400 cursor-wait opacity-75'
                                : 'bg-yellow-600 hover:bg-yellow-500 hover:scale-105'
                                }`}
                        >
                            <span className="text-2xl">{isScanning ? '⏳' : '📸'}</span>
                            <span>{isScanning ? 'Scanning...' : 'Add Item'}</span>
                        </button>

                        <button
                            onClick={handleFinish}
                            className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-4 px-12 rounded-2xl transform transition hover:scale-105 shadow-lg flex items-center gap-3"
                        >
                            <span>Finish & Claim</span>
                            <span className="text-2xl">➔</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
