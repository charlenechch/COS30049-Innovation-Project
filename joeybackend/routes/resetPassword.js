const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { decrypt, encrypt } = require('../utils/crypto');

// 🔁 POST /api/reset-password
router.post('/', async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ error: 'Username and new password are required.' });
  }

  try {
    const tables = ['admin', 'visitor', 'park_guide'];

    for (const table of tables) {
      let [rows] = await db.promise().query(`SELECT * FROM ${table}`);
    
      // Search for a match by decrypting each username
      const user = rows.find(row => decrypt(row.Username).trim().toLowerCase() === username.trim().toLowerCase());
    
      if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Use encrypted username in the WHERE clause
        await db.promise().query(`UPDATE ${table} SET Password = ? WHERE Username = ?`, [hashedPassword, user.Username]);
    
        console.log('--- Password Reset ---');
        console.log(`✅ Password reset for ${table} - ${username}`);
        console.log('New Password (Plain):', newPassword);
        console.log('New Password (Hashed):', hashedPassword);
        console.log('---------------------------------');
    
        return res.json({ message: `Password reset successful for ${table}.` });
      }
    }    

    return res.status(404).json({ error: 'User not found in any table.' });
  } catch (error) {
    console.error('Reset error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
