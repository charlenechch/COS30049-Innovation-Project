const crypto = require('crypto');
require('dotenv').config();

// Validate environment variables
if (!process.env.AES_KEY || !process.env.AES_IV) {
  throw new Error('AES_KEY and AES_IV must be defined in environment variables');
}

// Encryption configuration
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.AES_KEY, 'hex');
const iv = Buffer.from(process.env.AES_IV, 'hex');

// Validate key and IV lengths
if (key.length !== 32) {
  throw new Error(`Invalid AES_KEY length: must be 32 bytes (64 hex characters)`);
}
if (iv.length !== 16) {
  throw new Error(`Invalid AES_IV length: must be 16 bytes (32 hex characters)`);
}

// Encryption functions
function encrypt(text) {
  if (!text) throw new Error('Text to encrypt is required');
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  if (!encryptedText) throw new Error('Encrypted text is required');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };