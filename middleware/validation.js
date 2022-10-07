const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')

module.exports = {
validateReg :(req, res, next) => {
    const emailSyntax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const validPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    if(!req.body.username || req.body.username.length < 5 ){
        return res.status(400).send({
            message:"Please enter a username with a minimum of 5 characters."
        });
    }

     if (!req.body.email|| req.body.email.length === 0|| !req.body.email.match(emailSyntax)) {
        return res.status(400).send({
          message: 'Please enter a valid email address.'
        });
    }

     if (!req.body.password || req.body.password.length < 8 || !req.body.password.match(validPassword)) {
        return res.status(400).send({
          message: 'Please enter a strong password.'
        });
    }

    next();
},

validateQuestion: (req, res, next) => {
    //no white space
    const validQuestion =  /^\s+$/
    if(!req.body.question || req.body.question.length < 5 || req.body.question.match(validQuestion)){
        return res.status(400).send({
            message:"Please enter a question with at least 5 characters."
        });
    }
    next();
},

 auth : (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, jwtSecret)
        req.userData = decoded;
        next();
    }catch (error) {
        res.status(401).send({message: 'Please login.'})
    }
    }
}
