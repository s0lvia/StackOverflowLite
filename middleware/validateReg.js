const validateReg = async (req, res, next) => {
    if(!req.body.username.length < 5 ){
        return res.status(400).send({
            message:"Please enter a username with a minimum of 5 characters."
        });
    }

    if (!req.body.password.length < 8) {
        return res.status(400).send({
          message: 'Please enter a password with a minimum of 8 characters.'
        });
    }

    next();
}

module.exports = validateReg