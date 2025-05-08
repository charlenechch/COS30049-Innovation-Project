const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../config/db'); 
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const { encrypt, decrypt } = require('../utils/crypto');

router.post('/', verifyToken, authorizeRoles('Visitor'), (req, res) => {
  const { parkguide_name, ratings, comment } = req.body;

  if (!parkguide_name?.trim()) {
    return res.status(400).json({ error: "Park guide name is required" });
  }

  if (!ratings) {
    return res.status(400).json({ error: "Ratings are required" });
  }

  const requiredRatings = ['s1q1', 's1q2', 's1q3', 's2q1', 's2q2', 's2q3', 's3q1', 's3q2', 's3q3'];
  for (const key of requiredRatings) {
    if (ratings[key] === undefined || ratings[key] === null) {
      return res.status(400).json({ error: `Missing rating for ${key}` });
    }
  }

  const inputName = parkguide_name.trim().toLowerCase();

  db.query(
    'SELECT ParkGuideID, Fullname FROM park_guide WHERE role = "Park Guide"',
    (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: "Database error while finding guide" });
      }
      const matched = results.find(g => {
        const decryptedName = decrypt(g.Fullname).trim().toLowerCase();
        return decryptedName === inputName;
      });
  
      if (!matched) {
        return res.status(404).json({ error: "Park guide not found" });
      }
  
      const parkGuideId = matched.ParkGuideID;
  
      // Continue with inserting the feedback
      db.query(
        `INSERT INTO feedback (
          ParkGuideID,
          Rating_S1Q1, Rating_S1Q2, Rating_S1Q3,
          Rating_S2Q1, Rating_S2Q2, Rating_S2Q3,
          Rating_S3Q1, Rating_S3Q2, Rating_S3Q3,
          Comment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parkGuideId,
          ratings.s1q1, ratings.s1q2, ratings.s1q3,
          ratings.s2q1, ratings.s2q2, ratings.s2q3,
          ratings.s3q1, ratings.s3q2, ratings.s3q3,
          comment ? encrypt(comment) : null
        ],
        (err, result) => {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ error: "Failed to save feedback" });
          }
  
          res.status(201).json({ message: "Feedback submitted successfully!" });
        }
      );
    }
  );
});

// READ feedback for one Park Guide
router.get('/guide/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM feedback WHERE ParkGuideID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching feedback', error: err });
    res.status(200).json(result);
  });
});

// UPDATE feedback
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { Personality, Professionalism, Communication, Comments } = req.body;
  const sql = `
  UPDATE feedback SET 
    Rating_S1Q1 = ?, Rating_S1Q2 = ?, Rating_S1Q3 = ?,
    Rating_S2Q1 = ?, Rating_S2Q2 = ?, Rating_S2Q3 = ?,
    Rating_S3Q1 = ?, Rating_S3Q2 = ?, Rating_S3Q3 = ?,
    Comment = ?
  WHERE FeedbackID = ?
`;

  db.query(sql, [Personality, Professionalism, Communication, Comments, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating feedback', error: err });
    res.status(200).json({ message: 'Feedback updated successfully' });
  });
});

// DELETE feedback
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM feedback WHERE FeedbackID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting feedback', error: err });
    res.status(200).json({ message: 'Feedback deleted successfully' });
  });
});

module.exports = router;
