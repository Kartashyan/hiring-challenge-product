import * as crypto from 'crypto';

const customCrypto = {
    randomUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

if (typeof process !== 'undefined' && crypto && crypto?.randomUUID) {
    customCrypto.randomUUID = crypto.randomUUID;
} else if (typeof window !== 'undefined' && window?.crypto && window?.crypto?.randomUUID) {
    customCrypto.randomUUID = window.crypto.randomUUID.bind(window.crypto);
}

export const randomUUID = customCrypto.randomUUID;
export default randomUUID;