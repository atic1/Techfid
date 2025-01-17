const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const authenticate = require('../src/authenticate');
const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'techfid'
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected...');
});
router.post("/reaction/:postId", authenticate, (req, res) => {
   const userId = req.user.id; 
  
  const postId = req.params.postId;
    console.log(`Received Post ID: ${postId}`);
    const { action } = req.body; // 'like' or 'dislike'
    console.log(action)
  
    if (action !== 'like' && action !== 'dislike') {
      return res.status(400).send('Invalid action');
    }
  
    // Assuming JWT contains user id
  
    // Check if the user has already reacted
    const checkQuery = 'SELECT * FROM reactions WHERE post_id = ? AND user_id = ?';
    db.query(checkQuery, [postId, userId], (err, result) => {
      if (err) return res.status(500).send(err);
      
      if (result.length > 0) {
        return res.status(400).send('You have already reacted to this post');
      }
  
      // Insert reaction into the database
      const insertQuery = 'INSERT INTO reactions (post_id, user_id, reaction) VALUES (?, ?, ?)';
      db.query(insertQuery, [postId, userId, action], (err, result) => {
        if (err) return res.status(500).send(err);
  
        // Update the like or dislike count
        const updateQuery = action === 'like' 
          ? 'UPDATE postinfo SET like_count = like_count + 1 WHERE id = ?' 
          : 'UPDATE postinfo SET dislike_count = dislike_count + 1 WHERE id = ?';
  
        db.query(updateQuery, [postId], (err, result) => {
          if (err) return res.status(500).send(err);
          res.status(200).send('Reaction recorded successfully');
        });
      });
    });
  });
  
  module.exports = router;