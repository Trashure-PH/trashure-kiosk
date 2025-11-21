export interface UserProfile {
    uid: string;
    displayName: string;
    points: number;
}

export const getUser = async (uid: string): Promise<UserProfile | null> => {
    try {
        // Mock user service - returns demo user for any username
        return {
            uid,
            displayName: uid.startsWith('demo') ? 'Demo User' : uid,
            points: 150
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

export const addPointsToUser = async (uid: string, points: number): Promise<boolean> => {
    try {
        console.log(`[MOCK] Added ${points} points to ${uid}`);
        return true;
    } catch (error) {
        console.error('Error updating points:', error);
        return false;
    }
};
