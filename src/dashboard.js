const express = require("express");
const router = express.Router();
const mysql=require("mysql")

// Middleware to parse JSON
router.use(express.json());
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"techfid"
})


router.delete("/delete-item/:id",async(req,res)=>{
  const itemid=req.params.id //params allow user to store dynamic value from the url path
  try{
      const sql="UPDATE signup SET deleted_at=1 WHERE id=?"
      const sqli="UPDATE postinfo SET deleted_at=1 WHERE id=?"
      const sqlii="UPDATE newgroup SET deleted_at=1 WHERE id=?"
       con.query(sql,[itemid],function(err,result){
          if (err) {
              console.error("Error updating deleted_at:", err);
              return res.status(500).send("Database error: " + err.message);
            }
        
           
      })
      con.query(sqli,[itemid],function(err,result){
          if (err) {
              console.error("Error updating deleted_at:", err);
              return res.status(500).send("Database error: " + err.message);
            }
        
           
      })
      con.query(sqlii,[itemid],function(err,result){
          if (err) {
              console.error("Error updating deleted_at:", err);
              return res.status(500).send("Database error: " + err.message);
            }
        
           
      })

      
  }catch(error){
      console.log(error)
      
  }
})

    
      
      // Protect /dashboard route with an authentication check
    
      




router.get('/dashboard', (req, res) => {
  const sql = "SELECT * FROM signup WHERE deleted_at=0";
  const sqli = 'SELECT postinfo.*,newgroup.groupname AS groupname FROM postinfo JOIN newgroup ON postinfo.groupid=newgroup.id WHERE postinfo.deleted_at=0 ORDER BY id DESC'

  const sqlii = "SELECT * FROM newgroup WHERE deleted_at=0";

  // Execute the first query
  con.query(sql, (err1, dashboard) => {
      if (err1) {
          console.error("Error fetching login info:", err1);
          res.status(500).send("Error fetching login info");
      } else {
          // Execute the second query
          con.query(sqli, (err2, postresult) => {
              if (err2) {
                  console.error("Error fetching post info:", err2);
                  res.status(500).send("Error fetching post info")
              } else{
                con.query(sqlii,(err3,groupresult)=>{

                if(err3){
                  
                    res.status(500).send("err")
                  
                }else{
                  res.render('dashboard', {
                    dashboard: dashboard,
                    postdetails: postresult,
                    groupinfo:groupresult,
                    
                });
                }
              });
              }
              
          });
      }
  });
});
module.exports=router;

