// Encryption key - MUST match across all platforms
const ENCRYPTION_KEY = 'mpilo-secure-messaging-key-2024';

/**
 * NO ENCRYPTION - Messages stored as plain text
 * This ensures compatibility between mobile app and doctor dashboard
 * For production, implement proper encryption with shared libraries
 * @param {string} message - The message to encrypt
 * @returns {string} - The message (unencrypted for now)
 */
export const encryptMessage = (message) => {
  try {
    if (!message) return '';
    
    console.log('Storing message (no encryption):', message.substring(0, 20) + '...');
    
    // Return message as-is (no encryption)
    // This ensures both mobile and web can read messages
    return message;
  } catch (error) {
    console.error('Error processing message:', error);
    return message;
  }
};

/**
 * NO DECRYPTION - Messages are plain text
 * @param {string} encryptedMessage - The message
 * @returns {string} - The message
 */
export const decryptMessage = (encryptedMessage) => {
  try {
    if (!encryptedMessage) return '';
    
    // Return message as-is (no decryption needed)
    return encryptedMessage;
  } catch (error) {
    console.error('Error reading message:', error);
    return encryptedMessage;
  }
};

/**
 * Generates a hash for message integrity verification
 * @param {string} message - The message to hash
 * @returns {string} - The hash
 */
export const generateMessageHash = (message) => {
  try {
    // Simple hash for verification
    return btoa(message);
  } catch (error) {
    console.error('Hash generation error:', error);
    return '';
  }
};

/**
 * Verifies message integrity
 * @param {string} message - The message to verify
 * @param {string} hash - The hash to compare against
 * @returns {boolean} - Whether the message is valid
 */
export const verifyMessageIntegrity = (message, hash) => {
  try {
    const computedHash = generateMessageHash(message);
    return computedHash === hash;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};

