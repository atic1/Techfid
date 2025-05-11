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
router.post("/comments/:postId/:comment", authenticate, (req, res) => {
   const userId = req.user.id; 
  
  const postId = req.params.postId;
  
    console.log(`Received Post ID: ${postId}`);
   
      const content=req.params.comment
      console.log(content)
      const insertQuery = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
      db.query(insertQuery, [postId, userId, content], (err, result) => {
        if (err) return res.status(500).send(err);

    });
   
      res.status(200).send("Comment added successfully");
  
  
  
   
  
   
      });

      router.get('/comment/:postId?', (req, res) => {
        const postId = req.params.postId; // Get postId if provided
        
        let query = `
            SELECT postinfo.*, newgroup.groupname
            FROM postinfo
            JOIN newgroup ON postinfo.groupid = newgroup.id
        `;
    
        if (postId) {
            query += " WHERE postinfo.id = ?";
        }
    
        db.query(query, [postId], (err, posts) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving posts');
            }
    
            if (posts.length > 0) {
                // Now, for each post, fetch comments
                const postIds = posts.map(post => post.id);
                const commentQuery = `
                    SELECT comments.*, postinfo.id as post_id, newgroup.groupname
                    FROM comments
                    JOIN postinfo ON comments.post_id = postinfo.id
                    JOIN newgroup ON postinfo.groupid = newgroup.id
                    WHERE comments.post_id IN (?)
                `;
    
                db.query(commentQuery, [postIds], (err, comments) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error retrieving comments');
                    }
    
                    // Now we can pass both posts and comments to the view
                    posts.forEach(post => {
                        // Filter the comments for the current post
                        post.comments = comments.filter(comment => comment.post_id === post.id);
                    });
    
                    // Render the posts and their comments
                    res.render('comment', { posts });
                });
            } else {
                res.status(404).send('No posts found');
            }
        });
    });
    
    
    
    
    module.exports=router