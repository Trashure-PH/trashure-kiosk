import React, { useEffect, useState } from 'react';
import { useIdleReset } from '../../hooks/useIdleReset';

interface KioskLayoutProps {
    children: React.ReactNode;
}

export const KioskLayout: React.FC<KioskLayoutProps> = ({ children }) => {
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

    // Initialize Idle Timer
    useIdleReset();

    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    const sentinel = await navigator.wakeLock.request('screen');
                    setWakeLock(sentinel);
                    console.log('Wake Lock active');
                }
            } catch (err) {
                console.error('Wake Lock failed:', err);
            }
        };

        requestWakeLock();

        return () => {
            if (wakeLock) {
                wakeLock.release();
            }
        };
    }, []);

    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    };

    return (
        <div
            className="h-screen w-full bg-gray-900 text-white overflow-hidden relative flex flex-col"
            onClick={enterFullscreen} // Simple way to ensure fullscreen on first interaction
        >
            {children}

            {/* Hidden overlay to capture clicks for fullscreen if needed */}
            <div className="absolute top-0 left-0 w-full h-1 z-50 opacity-0" />
        </div>
    );
};
