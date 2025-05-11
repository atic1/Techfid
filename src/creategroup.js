var express = require('express');
const route = express.Router();
var mysql = require('mysql');
var authenticate = require('../src/authenticate');

// Database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "techfid"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL Database");
});

// Route to create a new group (prevents duplicate groups for the same user)
route.post('/createTable', authenticate, (req, res) => {
    const newgroup = req.body.newgroup;
    const userid = req.user.id;

    // Check if the group already exists for this user
    const checkSql = "SELECT * FROM newgroup WHERE groupname = ? AND userid = ?";
    con.query(checkSql, [newgroup, userid], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (result.length > 0) {
            // Group already exists for this user
            return res.status(400).send('You have already created this group.');
        }

        // Insert the new group if it doesn't exist
        const insertSql = "INSERT INTO newgroup (groupname, userid) VALUES(?, ?)";
        con.query(insertSql, [newgroup, userid], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error creating group');
            }

            console.log("Group created successfully");
            res.redirect("/techfidhome");
        });
    });
});

// Route to get all groups (excluding soft-deleted ones)
route.get('/post', (req, res) => {
    const sql = 'SELECT groupname FROM newgroup WHERE deleted_at = 0';

    con.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Database error');
        } 

        res.render('post', { post: result });
    });
});

module.exports = route;
