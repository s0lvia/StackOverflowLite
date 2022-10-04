const express = require('express')
const router = new express.Router()
const connection = require('../db/mysql')
const validateReg = require('../../middleware/validateReg')
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

//register new user
router.post('/v1/register', validateReg, auth, function (req,res) {
    var user = {
        userId: uuid(),
        username: req.body.username,
        email: req.body.email
    };

    connection.query(`SELECT * FROM users WHERE LOWER(username)=LOWER(${connection.escape(
        user.username
    )}));`,
    (error, result) => {
        if(result.length){
            return res.status(409).send({
                message:'This username is already in use!'
            });
        }else {
            bcrypt.hash(req.body.passsword,10, (error,hash) =>{
                if(error){
                    return res.status(500).send({
                        message: error
                    });
                }
                else {
                    connection.query(
                        `INSERT INTO users (userId, username, password, email) VALUES ('${uuid.v4()}', ${connection.escape(
                            req.body.username
                          )}, ${connection.escape(hash)}, ${connection.escape(req.body.email)})`,
                          function (error, result) {
                            if (error) {
    
                              return res.status(400).send({
                                message: error
                              });
                            }
                            return res.status(201).send({
                              message: 'Registered!',
                              username: req.body.username,
                              email: req.boy.email
                            });
                          }
                    );
                }
            })
        }
    }
    );
})
