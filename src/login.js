const express=require("express")
const router=express.Router()
const mysql=require("mysql")
const jwt =require("jsonwebtoken")

var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"techfid"
})
con.connect(function(err){
    if(err) throw err;
    console.log("connecter")
})
router.post("/login",(req,res)=>{
    let username=req.body.username
    let password=req.body.password
    var sql="SELECT * FROM signup WHERE username = ? AND password = ? AND deleted_at=0";
    
   

    con.query(sql,[username,password],function(err,result){
        if (result.length > 0) {
            const user=result[0]
            const token=jwt.sign({id:user.id,username:user.username},'secretkey',{expiresIn:'2h'})
            res.cookie("uid", token, {
                httpOnly: true,   // Ensures that the cookie is not accessible via JavaScript
                secure: false,    // Set this to true in production if using HTTPS
                sameSite: 'Lax',  // 'Lax' for same-origin requests; 'Strict' for more security
                maxAge: 3600000   // Cookie expiry (optional, 1 hour here)
            });
            
           
            return res.redirect("/techfidhome");
            


        } else {
            return res.status(401).send("Invalid credentials or account is deactivated.");
        }
    })
    
})

module.exports=router;