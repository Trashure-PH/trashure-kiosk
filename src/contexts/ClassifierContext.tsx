import React, { createContext, useContext, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

interface ClassifierContextType {
    model: mobilenet.MobileNet | null;
    isModelLoading: boolean;
    error: string | null;
}

const ClassifierContext = createContext<ClassifierContextType | undefined>(undefined);

export const ClassifierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                console.log('Loading MobileNet model...');
                await tf.ready();
                const loadedModel = await mobilenet.load({
                    version: 2,
                    alpha: 1.0,
                });
                setModel(loadedModel);
                setIsModelLoading(false);
                console.log('MobileNet model loaded globally');
            } catch (err: any) {
                console.error('Failed to load model:', err);
                setError(err.message || 'Failed to load AI model');
                setIsModelLoading(false);
            }
        };

        loadModel();
    }, []);

    return (
        <ClassifierContext.Provider value={{ model, isModelLoading, error }}>
            {children}
        </ClassifierContext.Provider>
    );
};

export const useClassifier = () => {
    const context = useContext(ClassifierContext);
    if (context === undefined) {
        throw new Error('useClassifier must be used within a ClassifierProvider');
    }
    return context;
};
