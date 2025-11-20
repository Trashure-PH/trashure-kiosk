import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
    uid: string;
    displayName: string;
    points: number;
}

export const getUser = async (uid: string): Promise<UserProfile | null> => {
    try {
        // For MVP/Demo without real backend connection, return a mock user if ID starts with "demo"
        if (uid.startsWith('demo')) {
            return {
                uid,
                displayName: 'Demo User',
                points: 150
            };
        }

        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

export const addPointsToUser = async (uid: string, points: number): Promise<boolean> => {
    try {
        if (uid.startsWith('demo')) {
            console.log(`[MOCK] Added ${points} points to ${uid}`);
            return true;
        }

        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            points: increment(points)
        });
        return true;
    } catch (error) {
        console.error('Error updating points:', error);
        return false;
    }
};
