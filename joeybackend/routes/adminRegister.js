const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const bodyParser = require('body-parser');
const { encrypt, decrypt } = require('../utils/crypto');
const verifyToken = require('../middleware/verifyToken');

const app = express();
app.use(bodyParser.json());


// CREATE (admin signup)
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
    const sql = 'INSERT INTO admin (Username, Email, Password) VALUES (?, ?, ?)';
    db.query(sql, [encryptedUsername, encryptedEmail, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      console.log('✅ Admin inserted:', result);
      res.status(201).json({ message: 'Admin signed up successfully' });
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// READ (Get all admin data with decrypted Username and Email)
router.get('/all', verifyToken, (req, res) => {
  const sql = "SELECT AdminID, Username, Email from admin";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching admin data", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Decrypt each Username and Email
    const decryptedResult = result.map(admin => ({
      AdminID: admin.AdminID,
      Username: decrypt(admin.Username),
      Email: decrypt(admin.Email)
    }));

    res.status(200).json(decryptedResult);
  });
});

// READ specific admin data
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM admin WHERE AdminID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching admin data", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(result[0]);
  });
});

// UPDATE (Update admin data)
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const sql = "UPDATE admin SET Username = ?, Email = ?, Password = ? WHERE AdminID = ?";

  db.query(sql, [username, email, password, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating admin", error: err });
    }
    res.status(200).json({ message: "Admin updated successfully", data: result });
  });
});

// DELETE (Delete admin)
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM admin WHERE adminID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting admin", error: err });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  });
});


module.exports = router;
