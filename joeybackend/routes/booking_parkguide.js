const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const bodyParser = require('body-parser');
const { encrypt, decrypt } = require('../utils/crypto');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');

const app = express();
app.use(bodyParser.json());

// CREATE 
router.post('/', verifyToken, authorizeRoles('Visitor'), (req, res) => {
  const { name, email, contact, date, timeSlot, guide } = req.body;

  console.log('Received data:', { name, email, contact, date, timeSlot, guide });

  const guideName = encrypt(guide.trim());

  // Find ParkGuideID
  const findGuideSQL = 'SELECT ParkGuideID FROM park_guide WHERE Fullname = ? LIMIT 1';
  db.query(findGuideSQL, [guideName], (err, guideResults) => {
    if (err) {
      console.error('❌ Error finding guide:', err);
      return res.status(500).json({ error: "Error finding park guide" });
    }

    console.log('Guide search result:', guideResults);

    if (guideResults.length === 0) {
      return res.status(404).json({ error: "Park guide not found" });
    }

    const parkGuideId = guideResults[0].ParkGuideID;
    console.log('Guide found:', guideName, 'with ID:', parkGuideId);

    // Find VisitorID based on email
    const encryptedUsername = encrypt(name.trim());
    const findVisitorSQL = 'SELECT VisitorID FROM visitor WHERE Username = ? LIMIT 1';
    db.query(findVisitorSQL, [encryptedUsername], (err, visitorResults) => {
      if (err) {
        console.error('❌ Error finding visitor:', err);
        return res.status(500).json({ error: "Error finding visitor" });
      }

      console.log('Visitor search result:', visitorResults);

      if (visitorResults.length === 0) {
        return res.status(404).json({ error: "Visitor not found" });
      }

      const visitorId = visitorResults[0].VisitorID;
      console.log('Visitor found:', name, 'with ID:', visitorId);

      // Step 3: Insert into booking_parkguide
      const insertSQL = `
        INSERT INTO booking_parkguide 
        (ParkGuideID, VisitorID, name, email, contact, date, timeSlot, guide)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const encryptedName = encrypt(name.trim());
      const encryptedEmail = encrypt(email.trim());
      const encryptedGuide = encrypt(guide.trim());
      const encryptedContact = encrypt(contact.trim());
      const encryptedDate = encrypt(date.trim());
      const encryptedTimeSlot = encrypt(timeSlot.trim());
      
      db.query(
        insertSQL,
        [parkGuideId, visitorId, encryptedName, encryptedEmail, encryptedContact, encryptedDate, encryptedTimeSlot, encryptedGuide],
        (err, result) => {
          if (err) {
            console.error('❌ Error inserting booking:', err);
            return res.status(500).json({ error: "Failed to insert booking" });
          }

          console.log('✅ Booking successful:', result);
          res.status(201).json({ message: "Booking park guide successfully" });
        }
      );
    });
  });
});

  
// READ 
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM booking_parkguide WHERE BookingID = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching booking_parkguide data", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Booking_parkguide not found" });
    }
    res.status(200).json(result[0]);
  });
});
  
// UPDATE
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, contact, date, timeSlot, guide } = req.body;
  const sql = "UPDATE booking_parkguide SET name = ?, email = ?, contact = ?, date = ?, timeSlot = ?, guide = ?";
  
  db.query(sql, [name, email, contact, date, timeSlot, guide, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating booking_parkguide", error: err });
    }
    res.status(200).json({ message: "Booking_parkguide updated successfully", data: result });
  });
});
  
// DELETE 
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM booking_parkguide WHERE BookingID = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting booking_parkguide", error: err });
    }
    res.status(200).json({ message: "Booking_parkguide deleted successfully" });
  });
});
  
  
module.exports = router;
  