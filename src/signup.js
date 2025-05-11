const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');

const expressed = path.join(__dirname, "../public");
router.use(express.static(expressed));

const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "techfid"
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL");
});

router.post('/signup', (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;

    // Check if any field is empty
    if (!first_name || !last_name || !username || !email || !password) {
        return res.status(400).send("All fields are required!");
    }

    // Check if the username or email already exists
    const checkSql = "SELECT * FROM signup WHERE username = ? OR email = ?";
    con.query(checkSql, [username, email], (err, results) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("Server error. Please try again.");
        }
        
        if (results.length > 0) {
            return res.status(400).send("Sorry, username or email is already taken.");
        }

        // Insert new user if username and email do not exist (even if first name & last name are same)
        const insertSql = "INSERT INTO signup (firstname, lastname, username, email, password) VALUES(?,?,?,?,?)";
        con.query(insertSql, [first_name, last_name, username, email, password], (err, result) => {
            if (err) {
                console.log("Error inserting data:", err);
                return res.status(500).send("Error signing up. Please try again.");
            } else {
                res.redirect("/signup.html");
            }
        });
    });
});

module.exports = router;
