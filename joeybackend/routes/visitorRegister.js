const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const bodyParser = require('body-parser');
const { encrypt, decrypt } = require('../utils/crypto');


// CREATE (visitor signup)
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Received data:', { username, email, password });

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Encrypt username and email
    const encryptedUsername = encrypt(username.trim());
    const encryptedEmail = encrypt(email);

    console.log('✅ Username:', username); 
    console.log('✅ Encrypted Email:', encryptedEmail);
    console.log('✅ Hashed Password:', hashedPassword);

    // Insert into MySQL
    const sql = 'INSERT INTO visitor (Username, Email, Password) VALUES (?, ?, ?)';
    db.query(sql, [encryptedUsername, encryptedEmail, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      console.log('✅ User inserted:', result);
      res.status(201).json({ message: 'User signed up successfully as Visitor' });
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// READ (Get visitor data)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM visitor WHERE VisitorID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching visitor data", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json(result[0]);
  });
});

// UPDATE (Update visitor data)
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const encryptedUsername = encrypt(username.trim());
    const encryptedEmail = encrypt(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "UPDATE visitor SET Username = ?, Email = ?, Password = ? WHERE VisitorID = ?";
    db.query(sql, [encryptedUsername, encryptedEmail, hashedPassword, id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating visitor", error: err });
      }
      res.status(200).json({ message: "Visitor updated successfully", data: result });
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Failed to update visitor" });
  }
});


// DELETE (Delete visitor)
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM visitor WHERE VisitorID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting visitor", error: err });
    }
    res.status(200).json({ message: "Visitor deleted successfully" });
  });
});


module.exports = router;
