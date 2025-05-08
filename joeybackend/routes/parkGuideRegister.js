const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const bodyParser = require('body-parser');
const { encrypt, decrypt } = require('../utils/crypto');


//park guide
router.post('/', async (req, res) => {
  const { username, fullname, email, password } = req.body;

  console.log('Received data:', { username, fullname, email, password });

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Encrypt username and email
    const encryptedUsername = encrypt(username.trim());
    const encryptedFullname = encrypt(fullname);
    const encryptedEmail = encrypt(email);

    console.log('✅ Encrypted Username:', encryptedUsername);
    console.log('✅ Encrypted Fullname:', encryptedFullname);
    console.log('✅ Encrypted Email:', encryptedEmail);
    console.log('✅ Hashed Password:', hashedPassword);

    // Insert into MySQL
    const sql = 'INSERT INTO park_guide (Username, Fullname, Email, Password) VALUES (?, ?, ?, ? )';
    db.query(sql, [encryptedUsername, encryptedFullname, encryptedEmail, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      console.log('✅ User inserted:', result);
      res.status(201).json({ message: 'User signed up successfully as Park Guide' });
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// GET all park guide details 
router.get('/all', (req, res) => {
  const sql = "SELECT ParkGuideID, Fullname FROM park_guide";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching all park guide data", error: err });
    }

    const decryptedResult = result.map(guide => ({
      ParkGuideID: guide.ParkGuideID,
      Fullname: decrypt(guide.Fullname)
    }));

    res.status(200).json(decryptedResult);
  });
});

// READ (Get visitor data)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM park_guide WHERE ParkGuideID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching guide data", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json(result[0]);
  });
});


// UPDATE (Update park guide data)
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, fullname, email, password } = req.body;

  // Encrypt before update
  const encryptedUsername = encrypt(username.trim());
  const encryptedFullname = encrypt(fullname.trim());
  const encryptedEmail = encrypt(email);
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = "UPDATE park_guide SET Username = ?, Fullname = ?, Email = ?, Password = ? WHERE ParkGuideID = ?";
  db.query(sql, [encryptedUsername, encryptedFullname, encryptedEmail, hashedPassword, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating park guide", error: err });
    }
    res.status(200).json({ message: "Park guide updated successfully", data: result });
  });
});

// DELETE (Delete park guide)
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM park_guide WHERE ParkGuideID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting park guide", error: err });
    }
    res.status(200).json({ message: "Park guide deleted successfully" });
  });
});


module.exports = router;
