import { useState, useRef } from 'react';
import { useClassifier } from '../contexts/ClassifierContext';

export interface DetectionResult {
    className: string;
    probability: number;
    isAllowed: boolean;
}

// Allowed classes for recycling
const ALLOWED_CLASSES = ['water bottle', 'pop bottle', 'wine bottle', 'can', 'cup'];

export const useAIClassifier = () => {
    const { model, isModelLoading } = useClassifier();
    const [detection, setDetection] = useState<DetectionResult | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const detect = async () => {
        if (model && videoRef.current && videoRef.current.readyState === 4) {
            const predictions = await model.classify(videoRef.current);

            if (predictions && predictions.length > 0) {
                const topPrediction = predictions[0];

                // Check if confidence is high enough for ANY detection
                if (topPrediction.probability > 0.3) {
                    const isAllowed = ALLOWED_CLASSES.some(c => topPrediction.className.toLowerCase().includes(c));

                    console.log(`🔍 Detected: ${topPrediction.className} (${(topPrediction.probability * 100).toFixed(1)}%) - Allowed: ${isAllowed}`);

                    setDetection({
                        className: topPrediction.className,
                        probability: topPrediction.probability,
                        isAllowed
                    });
                } else {
                    setDetection(null);
                }
            }
        }
    };

    return {
        videoRef,
        detect,
        isModelLoading,
        detection
    };
};
