const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { encrypt, decrypt } = require('../utils/crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const cleanUsername = encrypt(username.trim());

  try {
    let user = null;
    let role = null;

    // Try Admin
    const [admins] = await db.promise().query(
      'SELECT * FROM admin WHERE Username = ? LIMIT 1',
      [cleanUsername]
    );
    if (admins.length > 0 && await bcrypt.compare(password, admins[0].Password)) {
      user = admins[0];
      role = 'Admin';
    }

    // Try Park Guide
    if (!user) {
      const [guides] = await db.promise().query(
        'SELECT * FROM park_guide WHERE Username = ? LIMIT 1',
        [cleanUsername]
      );
      if (guides.length > 0 && await bcrypt.compare(password, guides[0].Password)) {
        user = guides[0];
        role = 'Park Guide';
      }
    }

    // Try Visitor
    if (!user) {
      const [visitors] = await db.promise().query(
        'SELECT * FROM visitor WHERE Username = ? LIMIT 1',
        [cleanUsername]
      );
      if (visitors.length > 0 && await bcrypt.compare(password, visitors[0].Password)) {
        user = visitors[0];
        role = 'Visitor';
      }
    }

    // No match found
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.promise().query(
      'REPLACE INTO otp_verification (username, otp, expires_at) VALUES (?, ?, ?)',
      [cleanUsername, otp, expiresAt]
    );

    console.log('Sending OTP to:', user.Email || user.email);

    const encryptedEmail = user.Email || user.email;

    let recipientEmail;
    try {
      recipientEmail = decrypt(encryptedEmail);
      console.log('Decrypted email:', recipientEmail); // 🔍 for debugging
    } catch (e) {
      console.error('Failed to decrypt email:', e);
      return res.status(500).json({ error: 'Email decryption failed' });
    }
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`
    });    

    return res.json({
      success: true,
      message: 'OTP sent',
      otpSent: true,
      role
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication error' });
  }
});

  function sendAuthResponse(res, user, role) {
    try {
      const token = jwt.sign(
        {
          id: user.AdminID || user.VisitorID || user.ParkGuideID,
          username: user.Username || user.username, // case-insensitive fallback
          role: role
        },
        JWT_SECRET,
        { expiresIn: '4h' }
      );
  
      // Exclude password from response
      const { Password, password, ...userData } = user;
  
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: userData,
        role
      });
    } catch (err) {
      console.error('sendAuthResponse error:', err);
      return res.status(500).json({ error: 'Token generation failed' });
    }
  }

module.exports = router;