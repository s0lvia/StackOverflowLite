const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET


const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, jwtSecret)
        req.userData = decoded;
        next();
    }catch (error) {
        res.status(401).send({message: 'Authentication failed. Please authenticate.'})
    }
}

module.exports = auth