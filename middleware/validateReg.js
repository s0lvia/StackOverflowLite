const jwtSecret = process.env.JWT_SECRET

module.exports = {
validateReg :(req, res, next) => {
    if(!req.body.username || req.body.username.length < 5 ){
        return res.status(400).send({
            message:"Please enter a username with a minimum of 5 characters."
        });
    }

     if (!req.body.email|| req.body.email.length === 0) {
        return res.status(400).send({
          message: 'Please enter a valid email address.'
        });
    }

     if (!req.body.password || req.body.password.length < 8) {
        return res.status(400).send({
          message: 'Please enter a password with a minimum of 8 characters.'
        });
    }

    next();
},

 auth : async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, jwtSecret)
        req.userData = decoded;
        next();
    }catch (error) {
        res.status(401).send({message: 'Your session is not valid'})
    }
    }
}
