import { useState, useRef } from 'react';
import { useClassifier } from '../contexts/ClassifierContext';

export interface DetectionResult {
    className: string;
    probability: number;
}

// Allowed classes for recycling
const ALLOWED_CLASSES = ['water bottle', 'pop bottle', 'beer bottle', 'wine bottle', 'can', 'beer glass', 'coffee mug', 'cup'];

export const useAIClassifier = () => {
    const { model, isModelLoading } = useClassifier();
    const [detection, setDetection] = useState<DetectionResult | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const detect = async () => {
        if (model && videoRef.current && videoRef.current.readyState === 4) {
            const predictions = await model.classify(videoRef.current);

            if (predictions && predictions.length > 0) {
                // Check if top prediction is in our allowed list
                const topPrediction = predictions[0];
                const isAllowed = ALLOWED_CLASSES.some(c => topPrediction.className.toLowerCase().includes(c));

                if (isAllowed && topPrediction.probability > 0.3) {
                    console.log(`✅ Detected: ${topPrediction.className} (${(topPrediction.probability * 100).toFixed(1)}% confidence)`);
                    setDetection(topPrediction);
                } else {
                    if (isAllowed) {
                        console.log(`⚠️ Low confidence: ${topPrediction.className} (${(topPrediction.probability * 100).toFixed(1)}%)`);
                    }
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
