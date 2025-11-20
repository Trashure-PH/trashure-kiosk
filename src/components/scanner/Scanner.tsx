import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useAIClassifier } from '../../hooks/useAIClassifier';
import { useCamera } from '../../contexts/CameraContext';

interface ScannerProps {
    onScan: (item: string) => void;
}

export interface ScannerRef {
    forceDetect: () => Promise<void>;
}

export const Scanner = forwardRef<ScannerRef, ScannerProps>(({ onScan }, ref) => {
    const { videoRef, detect, isModelLoading, detection } = useAIClassifier();
    const { stream, error: cameraError } = useCamera();

    const [status, setStatus] = useState<'idle' | 'detecting' | 'success'>('idle');
    const [countdown, setCountdown] = useState(3);
    const [detectedItemName, setDetectedItemName] = useState('');

    const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Expose forceDetect method for instant manual scanning (no countdown)
    useImperativeHandle(ref, () => ({
        forceDetect: async () => {
            // Only allow manual detection when idle
            if (status !== 'idle' || !videoRef.current) {
                console.log('Manual scan ignored - not ready');
                return;
            }

            console.log('📸 Capturing snapshot for instant scan...');

            // Run detection on current video frame
            await detect();

            // Give a small delay for detection state to update
            setTimeout(() => {
                if (detection) {
                    console.log('✅ Instant scan detected:', detection.className);
                    // Skip countdown - add item immediately
                    setStatus('success');
                    setDetectedItemName(detection.className);
                    onScan(detection.className);

                    // Show success animation briefly then reset
                    setTimeout(() => {
                        setStatus('idle');
                        setCountdown(3);
                    }, 1500);
                } else {
                    console.log('❌ Snapshot: No recyclable item detected');
                }
            }, 150);
        }
    }), [status, detect, detection, videoRef, onScan]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Play error:", e));
        }
    }, [stream, videoRef]);

    // Automatic detection loop - runs continuously
    useEffect(() => {
        if (!isModelLoading && status !== 'success' && stream) {
            const detectionInterval = setInterval(() => {
                detect();
            }, 500); // Check every 500ms

            return () => clearInterval(detectionInterval);
        }
    }, [isModelLoading, detect, status, stream]);

    // Automatic state machine - triggers when detection found
    useEffect(() => {
        if (status === 'idle' && detection) {
            console.log('🤖 Auto-detected:', detection.className);
            setStatus('detecting');
            setDetectedItemName(detection.className);
            setCountdown(3);
        } else if (status === 'detecting') {
            // If detection is lost during countdown, reset
            if (!detection || detection.className !== detectedItemName) {
                setStatus('idle');
                setCountdown(3);
            }
        }
    }, [detection, status, detectedItemName]);

    useEffect(() => {
        if (status === 'detecting') {
            countdownInterval.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) return 0;
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
        }

        return () => {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
        };
    }, [status]);

    useEffect(() => {
        if (status === 'detecting' && countdown === 0) {
            setStatus('success');
            onScan(detectedItemName);

            setTimeout(() => {
                setStatus('idle');
                setCountdown(3);
            }, 2000);
        }
    }, [countdown, status, detectedItemName, onScan]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
                autoPlay
                playsInline
                muted
            />

            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                {isModelLoading && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10">
                        <div className="text-xl text-white animate-pulse flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                            Initializing AI Vision...
                        </div>
                    </div>
                )}

                {cameraError && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900/90 backdrop-blur-xl px-8 py-6 rounded-2xl border border-red-500/30 text-center max-w-md">
                        <div className="text-4xl mb-2">📷❌</div>
                        <div className="text-xl font-bold text-white mb-1">Camera Error</div>
                        <div className="text-red-200">{cameraError}</div>
                    </div>
                )}

                {!isModelLoading && !cameraError && (
                    <>
                        {status === 'idle' && (
                            <div className="bg-black/40 backdrop-blur-md px-10 py-6 rounded-3xl border border-white/10 animate-float shadow-2xl">
                                <div className="text-3xl font-bold text-white text-center">
                                    Place item in Kiosk
                                </div>
                                <div className="text-gray-300 text-center mt-2 text-sm uppercase tracking-widest">
                                    Auto-Detecting or Click "Add Item"
                                </div>
                            </div>
                        )}

                        {status === 'detecting' && (
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            className="text-gray-700"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={552}
                                            strokeDashoffset={552 - (552 * (3 - countdown)) / 3}
                                            className="text-yellow-400 transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl font-black text-white">{countdown}</span>
                                    </div>
                                </div>

                                <div className="mt-8 bg-yellow-500/90 backdrop-blur-xl px-8 py-3 rounded-full text-black font-bold text-2xl shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-pulse">
                                    Scanning {detectedItemName}...
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="flex flex-col items-center animate-bounce-in">
                                <div className="w-40 h-40 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.6)] mb-6">
                                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="bg-green-600/90 backdrop-blur-xl px-10 py-4 rounded-full text-white font-black text-4xl shadow-lg border border-green-400/30">
                                    +10 Points!
                                </div>
                                <div className="mt-4 text-green-400 font-bold text-xl uppercase tracking-widest drop-shadow-md">
                                    {detectedItemName} Accepted
                                </div>
                            </div>
                        )}

                        {status !== 'success' && (
                            <div className={`absolute inset-0 m-8 border-[4px] rounded-3xl transition-all duration-500 ${status === 'detecting'
                                    ? 'border-yellow-400/60 scale-95 shadow-[inset_0_0_50px_rgba(234,179,8,0.2)]'
                                    : 'border-white/10 scale-100'
                                }`}>
                                <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-white/40 rounded-tl-3xl" />
                                <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-white/40 rounded-tr-3xl" />
                                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-white/40 rounded-bl-3xl" />
                                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-white/40 rounded-br-3xl" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

Scanner.displayName = 'Scanner';
