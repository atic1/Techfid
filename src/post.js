const express=require("express")
const router=express.Router()
const mysql =require('mysql')
const path =require('path')
const http=require('http')
const multer =require('multer')
const authenticate=require('../src/authenticate.js')

const {Server}=require('socket.io')

module.exports=(app,io)=>{
    const expressed=path.join(__dirname,"../public")  //joining public folder in post.js
console.log(path.join(__dirname,"../public"))
app.use(express.static(expressed))   //jusing public folder in post.js

app.use(express.urlencoded({
    extended:true
}))
const storage=multer.diskStorage({     //so in node js and express multer is used to store files and images in new folder
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, '../public/uploads')); //so destination means where we are storing user uploaded files and folders
    },
    filename: function (req,file,cb){
        const uniqueimg=Date.now()+'-'+Math.floor(Math.random()*1E9) //many files will have same name so storing random name in uniqueimg variable
        const extension = path.extname(file.originalname);
        cb(null,uniqueimg+extension);
    }
})
const upload=multer({storage:storage}) // here this line initialize multer as a middleware for handling files and images
//here storage is used to initialze where the files and images are being stored and we have initialize storeage in destination
//using multer.diskstorage
router.use(express.urlencoded({extended:true})) //It takes the incoming data from the request body 
// (sent in POST, PUT, or PATCH methods) and converts it into a JavaScript object.
router.use(express.json()) //This middleware is used to parse JSON data from incoming requests


var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"techfid"
})
con.connect(function(err){
    if(err) throw err;
    console.log("connected");
})
io.on('connection',(socket)=>{
    console.log("a socket connected");
    socket.emit('alert', 'Socket Connected!');
    socket.on("disconnect",()=>{
        console.log("disconnect")
        
    })

})
app.post("/submit",authenticate,upload.fields([{name:'images'},{name:'files'}]),(req,res)=>{
   
    let posthead=req.body.posthead
    let postdescription=req.body.postdescription
    let images = req.files?.images?.[0]?.filename || null;
    let files = req.files?.files?.[0]?.filename || null;

    let groups=req.body.groupname;
    let userid=req.user.id
    console.log(userid)
    const getGroupIdQuery = "SELECT id FROM newgroup WHERE GROUPNAME = ?";
        con.query(getGroupIdQuery, [groups], (err, groupResult) => {
            if (err) {
                console.error("Error fetching group ID:", err);
                return res.status(500).send("Database error while validating groupname");
            }
            const groupid=groupResult[0].id
            
    
    

    
        var sql="INSERT INTO postinfo (groupid,userid,header,description,files,images) VALUES (?,?,?,?,?,?)"
        
        con.query(sql, [groupid,userid,posthead,postdescription, files, images], function (err, result){
            if(err) throw err;
            console.log("record success");
           
           
           
            if (err) {
                const updateIsNewQuery = "UPDATE postinfo SET is_new = 1 WHERE is_new=0";
                con.query(updateIsNewQuery, (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating is_new flag for fetched posts:', updateErr);
                    } else {
                        console.log('Successfully updated is_new flag for fetched posts.');
                    }
                });
            }
            const count="SELECT COUNT(*) AS count FROM postinfo WHERE is_new=0"
            con.query(count,(err,countresult)=>{
                if(err) throw err
                const postcount=countresult[0].count
                io.emit("newpost",{
                    number:`Home${postcount}`,
                    groupname:groups,
                    header:posthead,
                    description:postdescription,
                    files:files,
                    images:images,
                });
            })
            res.redirect("/techfidhome");
        })
    })
})

    app.get('/techfidhome', (req, res) => {
        const sql1 = 'SELECT postinfo.*,newgroup.GROUPNAME AS groupname FROM postinfo JOIN newgroup ON postinfo.groupid=newgroup.id WHERE postinfo.deleted_at=0 ORDER BY id DESC'
        const sql2 = 'SELECT postinfo.*,signup.username AS username FROM postinfo JOIN signup ON postinfo.userid=signup.id WHERE postinfo.deleted_at=0 ORDER BY id DESC'
        
    
    con.query(sql1, (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Database error');
        }
       

         else {
            con.query(sql2, (err, result1) => {
                if (err) {
                    console.error('Error fetching data:', err);
                    res.status(500).send('Database error');
                }

            // const numbercount=result.map((post,index)=>({
            //     ...post,
            //     number:`home-${index+1}`
            // }))
           // res.render('techfidhome', { techfidhome: result }) //it will send result from the database to techfidhome page 
            //and that data will be shown to user using ejs file
            res.render("techfidhome", {
                techfidhome: result.map((post, index) => ({
                    ...post,
                    number: `Home${index + 1}`,

                    
                   
                    
                })),
            });
        });

        }
       
    
      
    });
    
    
    
})



}

    

    





