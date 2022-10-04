const express = require('express')
const router = new express.Router()
const connection = require('../db/mysql')
const validateReg = require('../../middleware/validateReg')

//register new user
router.post('/v1/register', validateReg, function (req,res) {
    var user = {
        userId: uuid(),
        username: req.body.username,
        email: req.body.email
    };
    connection.query('INSERT INTO users SET ?', user, function(err, result) {
        if (err) throw err;
        res.redirect("/");
    });
})
