const express=require("express")
const sql=require("sql")
const route=express.Router()
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"techfid"
})


con.connect(function(err){
    if(err) throw err
    console.log("connected");
});
