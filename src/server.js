var http =require("http");
var fs =require('fs');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

const server=http.createServer(app)
const { Server } = require("socket.io");
const io=new Server(server)
app.use(cookieParser());

app.set('views', path.join(__dirname, '../public/views')); 
app.set('view engine', 'ejs');
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use `true` if serving over HTTPS
}));




const expressed=path.join(__dirname,"../public")
console.log(path.join(__dirname,"../public"))
app.use(express.static(expressed))
app.use(express.urlencoded({
    extended:true
}))

const post=require("./post")
post(app,io)
const signup=require("./signup")
app.use(signup)
const login=require("./login")
app.use(login)
const dashboard=require("./dashboard")
app.use(dashboard)
const likedislike=require("./likedislike")
app.use(likedislike)






const creategroup=require("./creategroup")
app.use(creategroup)


app.get('/post', (req, res) => {
  
  res.render('post'); 
});

app.get('/postdetails',(req,res)=>{
  res.render('postdetails')
})

app.get('/groupinfo',(req,res)=>{
  res.render('groupinfo')
})
app.get('techfidhome',(req,res)=>{
  res.render('techfidhome')
})

post(app,io)
app.get('dashboard',(re,res)=>{
  res.render('dashboard')
})





// Serve static files from the "public" directory




server.listen(3000,()=>{
  console.log("listning")
})
