const express = require('express');
const router = express.Router();

// GET Login Page
module.exports=(app,io)=>{
    app.get('/dashlogin', (req, res) => {
        if (req.session.loggedIn) {
          return res.redirect('/dashboard');
         
        }
        res.sendFile(path.join(__dirname, '../public/login.html'));
      });
      
      // POST Login Form
      app.post('/login', (req, res) => {
        const { dashusername, dashpassword } = req.body;
      
        // Simple login check
        if (dashusername === 'admin' && dashpassword === 'admin') {
          req.session.loggedIn = true;
          return res.redirect('/dashboard');
        }
      
        res.send('<h1>Invalid Credentials. Please try again.</h1><a href="/login">Go Back</a>');
      });
      
      // GET Dashboard Page
      app.get('/dashboard', (req, res) => {
        if (!req.session.loggedIn) {
          return res.redirect('/login');
        }
        const dashboard=require("./dashboard");
        app.use(dashboard)
        res.render('dashboard');
      });
      
      // Logout Route
      router.get('/logout', (req, res) => {
        req.session.destroy(() => {
          res.redirect('/login.html');
        });
      });

}



