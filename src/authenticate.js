const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.uid;
    console.log(token)
    
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, 'secretkey'); // Replace 'secretkey' with your secret
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;
