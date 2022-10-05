const express = require('express')
const router = new express.Router()
const connection = require('../../db/mysql')
const userMiddleware = require('../../middleware/validateReg')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

router.post('/register', userMiddleware.validateReg, async function (req,res) {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    var user = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }
    connection.query(`SELECT * FROM users WHERE LOWER(email)=LOWER(${connection.escape(user.email)})`,
    (error, result) => {
        if(result.length){
            return res.status(409).send({
                message:'This email is already in use!'
            });
        }
   
    
    connection.query(`SELECT * FROM users WHERE LOWER(username)=LOWER(${connection.escape(user.username)}) OR LOWER(email)=LOWER(${connection.escape(user.email)})`,
        async (error, result) => {
            if(result.length){
                return res.status(409).send({
                    message:'This username is already in use!'
                });
            }else {
                connection.query(
                    `INSERT INTO users (username, password, email) VALUES (${connection.escape(user.username)}, ${connection.escape(user.password)}, ${connection.escape(user.email)})`,
                      function (error, result) {
                        
                        if (error) {

                          return res.status(400).send({
                            message: "Make sure all fields are filled."
                          });
                        }
                        return res.status(201).send({
                          message: 'Registered!',
                          user: {
                            username: req.body.username,
                            email: req.body.email
                          }
                        });
                      }
                );
            }
        }
    );
})
});

router.post('/login',  async (req, res, next) => {
    const query =  `SELECT * FROM users WHERE LOWER(username) = LOWER(${connection.escape(req.body.username)}) OR LOWER(email) = LOWER(${connection.escape(req.body.username)})`
    connection.query(query, (error, result) => {
        if(error){
            return res.status(401).send({
                message: 'Username/Email not recognized.'
            });
        }

        if(!result.length){
            return res.status(401).send({
                message: 'Username/Email or password is incorrect.'
            });
        }

        bcrypt.compare(
            req.body.password,
            result[0]['password'],
            async (perr, presult) => {
                if(perr) {
                    return res.status(401).send({
                        message:"Username/Email or password incorrect!"
                    });
                }

                if(presult){
                    
                    const token = jwt.sign({
                        username: result[0].username || result[0].email,
                        userId: result[0].id
                    },
                    jwtSecret,
                    {
                        expiresIn:'1d'
                    }
                    );
            
                    return await res.status(200).send({
                        message: "Logged in!",
                        token,
                        user: result[0]
                    });
                }
                return res.status(401).send({
                    message:"Username/Email or password is incorrect"
                });
            }
        )
    })
});

module.exports = router
