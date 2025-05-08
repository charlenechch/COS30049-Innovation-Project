const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key';
const { decrypt, encrypt } = require('../utils/crypto');

router.post('/', async (req, res) => {
  const { username, otp } = req.body;
  console.log("🔐 OTP verification request received:", { username, otp });

  if (!username || !otp) {
    console.log("❌ Missing username or OTP");
    return res.status(400).json({ error: 'Username and OTP required' });
  }

  try {
    const encryptedUsername = encrypt(username.trim());
    // Check OTP record
    const [rows] = await db.promise().query(
      'SELECT * FROM otp_verification WHERE username = ? LIMIT 1',
      [encryptedUsername]
    );

    if (rows.length === 0) {
      console.log("❌ No OTP record found for user:", username);
    } else {
      console.log("📄 OTP row found:", rows[0]);
    }

    if (rows.length === 0 || rows[0].otp !== otp || new Date() > new Date(rows[0].expires_at)) {
      console.log("❌ OTP mismatch or expired:", {
        dbOtp: rows[0]?.otp,
        userOtp: otp,
        expiresAt: rows[0]?.expires_at
      });
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // OTP is valid – fetch user info
    console.log("✅ OTP verified. Looking up user...");

    // 1. Get all users from all tables
    const [adminRows] = await db.promise().query('SELECT AdminID AS id, Username, Email, Password, "Admin" AS role FROM admin');
    const [guideRows] = await db.promise().query('SELECT ParkGuideID AS id, Username, Email, Password, "Park Guide" AS role FROM park_guide');
    const [visitorRows] = await db.promise().query('SELECT VisitorID AS id, Username, Email, Password, "Visitor" AS role FROM visitor');

    const allUsers = [...adminRows, ...guideRows, ...visitorRows];

    // 2. Find match by decrypting username
    const matchedUser = allUsers.find(user => {
      try {
        return decrypt(user.Username).trim().toLowerCase() === username.trim().toLowerCase();
      } catch (err) {
        console.warn("⚠️ Failed to decrypt username:", user.Username);
        return false;
      }
    }); 

    if (!matchedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("✅ User found:", matchedUser);

    // Generate token
    const token = jwt.sign(
      {
        id: matchedUser.id,
        username: decrypt(matchedUser.Username),
        role: matchedUser.role
      },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Clean up OTP
    await db.promise().query('DELETE FROM otp_verification WHERE username = ?', [encryptedUsername]);
    console.log("🧹 OTP deleted. Sending token...");

    return res.json({ success: true, token, role: matchedUser.role });

  } catch (err) {
    console.error('❌ OTP verification error:', err);
    return res.status(500).json({ error: 'OTP verification failed' });
  }
});

module.exports = router;
