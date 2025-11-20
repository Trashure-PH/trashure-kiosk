import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface CameraContextType {
    stream: MediaStream | null;
    error: string | null;
    isStreaming: boolean;
    startCamera: () => Promise<void>;
    stopCamera: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        if (streamRef.current) return; // Already running

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false,
                });
                streamRef.current = newStream;
                setStream(newStream);
                setIsStreaming(true);
                setError(null);
            } catch (err: any) {
                console.error('Error accessing camera:', err);
                setError(err.message || 'Camera access denied');
                setIsStreaming(false);
            }
        } else {
            setError('Camera API not supported');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setStream(null);
            setIsStreaming(false);
        }
    };

    // Auto-start camera on mount (Kiosk mode usually wants this ready)
    useEffect(() => {
        // Don't block rendering - start camera asynchronously
        const initCamera = async () => {
            try {
                await startCamera();
            } catch (err) {
                console.error('Camera initialization error:', err);
            }
        };
        initCamera();

        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <CameraContext.Provider value={{ stream, error, isStreaming, startCamera, stopCamera }}>
            {children}
        </CameraContext.Provider>
    );
};

export const useCamera = () => {
    const context = useContext(CameraContext);
    if (context === undefined) {
        throw new Error('useCamera must be used within a CameraProvider');
    }
    return context;
};
