const express=require("express")
const  mysql=requie("mysql")
const route=express.Router()
const multer=require("multer")
const storage=multer.diskStorage({
    destination:function (req,file,cb){
        let filenames=req.body.images
        cb(null,'/public/uploads/images')


    },
    filename: function (req,file,cb){
        const uniqueimg=Date.now()+'-'+Math.floor(Math.random()*1E9)
        cb(null,uniqueimg+file.mimetype.split("/")[1]);
    }
})
const upload =multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:5*1024*1024}
})
route.post('/post', upload.array("images",5),(req,res)=>{
    if(!req.files || req.files.length===0){
        return res.status(400).send("no files uploaded")

    }
    res.status(200).json({
        message:"files uploaded success",
        files:req.files.map(file=> file.filename)
    })
})