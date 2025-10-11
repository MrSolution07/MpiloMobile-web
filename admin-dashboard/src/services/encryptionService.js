import CryptoJS from 'crypto-js';

// Encryption key - MUST match across all platforms
const ENCRYPTION_KEY = 'mpilo-secure-messaging-key-2024';

/**
 * Encrypts a message using AES encryption
 * @param {string} message - The message to encrypt
 * @returns {string} - The encrypted message
 */
export const encryptMessage = (message) => {
  try {
    if (!message) return '';
    
    const encrypted = CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
};

/**
 * Decrypts an encrypted message
 * @param {string} encryptedMessage - The encrypted message
 * @returns {string} - The decrypted message
 */
export const decryptMessage = (encryptedMessage) => {
  try {
    if (!encryptedMessage) return '';
    
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Decryption failed - invalid message or key');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Return a placeholder for corrupted messages
    return '[Message could not be decrypted]';
  }
};

/**
 * Generates a hash for message integrity verification
 * @param {string} message - The message to hash
 * @returns {string} - The hash
 */
export const generateMessageHash = (message) => {
  return CryptoJS.SHA256(message).toString();
};

/**
 * Verifies message integrity
 * @param {string} message - The message to verify
 * @param {string} hash - The hash to compare against
 * @returns {boolean} - Whether the message is valid
 */
export const verifyMessageIntegrity = (message, hash) => {
  const computedHash = generateMessageHash(message);
  return computedHash === hash;
};

