import CryptoJS from 'crypto-js';

// In a real app, this secret should be managed more securely or the signing should happen server-side.
// For this MVP/Kiosk demo, we are doing it client-side as requested.
const SECRET_KEY = 'trashure-kiosk-secret-key-mvp';

export interface ReceiptData {
    kioskId: string;
    timestamp: number;
    points: number;
    items: string[];
    nonce: string;
}

export interface SignedReceipt extends ReceiptData {
    signature: string;
}

export const generateReceipt = (items: string[], points: number): string => {
    const data: ReceiptData = {
        kioskId: 'kiosk_001',
        timestamp: Date.now(),
        points,
        items,
        nonce: Math.random().toString(36).substring(7),
    };

    // Create the payload string to sign
    const payload = JSON.stringify(data);

    // Sign with HMAC-SHA256
    const signature = CryptoJS.HmacSHA256(payload, SECRET_KEY).toString(CryptoJS.enc.Hex);

    const signedReceipt: SignedReceipt = {
        ...data,
        signature
    };

    return JSON.stringify(signedReceipt);
};
