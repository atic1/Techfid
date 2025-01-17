var express=require('express')
const route=express.Router()
var mysql=require('mysql')

var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"techfid"
})


con.connect(function(err){
    if(err) throw err
    console.log("connected");
})

route.post('/createTable', (req, res) => {
    const newgroup = req.body.newgroup;
    
        var sql="INSERT INTO newgroup (groupname) VALUES(?)"
        con.query(sql,[newgroup],function(err,result){
            if(err) throw err;
            console.log("table created")
            res.redirect("/techfidhome")
        })
        })
        route.get('/post', (req, res) => {
            const sql = 'SELECT groupname FROM newgroup WHERE deleted_at=0';
        
        con.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching data:', err);
                res.status(500).send('Database error');
            } else {
                res.render('post', { post: result });
                
            }
            
          
        })
        
        
        
    })
    // route.get('/dashboard', (req, res) => {
    //     const sql = 'SELECT groupname FROM newgroup WHERE deleted_at=0';
    
    // con.query(sql, (err, result) => {
    //     if (err) {
    //         console.error('Error fetching data:', err);
    //         res.status(500).send('Database error');
    //     } else {
    //         res.render('dashboard', { dashboard: result })
            
    //     }
        
      
    // });
    
    
    
//})
  

            
    



module.exports=route;