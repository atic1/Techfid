const express=require('express')
const router=express.Router()
const mysql=require('mysql')
const path=require('path')
const expressed=path.join(__dirname,"../public")
router.use(express.static(expressed))
var con=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:"techfid"
});
router.get('/',(req,res) => {
    res.sendFile(__dirname + 'login.html')
});
con.connect(function(err){
    if(err) throw err
    console.log("connected")
})
router.post('/signup',(req,res)=>{
    const firstname=req.body.first_name 
    const lastname=req.body.last_name 
    const username=req.body.username 
    const email=req.body.email 
    const password =req.body.password 
    var sql="INSERT INTO signup (firstname,lastname,username,email,password) VALUES(?,?,?,?,?)"
    con.query(sql,[firstname,lastname,username,email,password],function(err,result){
        if(err)
        {
            console.log("cannot login")
        }
        else{
            res.redirect("/login.html")

        }
    })
   

})


module.exports=router

