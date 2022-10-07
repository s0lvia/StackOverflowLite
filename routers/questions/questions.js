const express = require('express');
const router = new express.Router();
const connection = require('../../db/mysql');
const userMiddleware = require('../../middleware/validation');

router.post('/api/v1/questions', userMiddleware.auth, userMiddleware.validateQuestion, async (req, res) => {
    var questionData = {
        question: req.body.question,
        userId: req.userData.userId
    }
    const query = `INSERT INTO questions (question, userId) VALUES (${connection.escape(questionData.question)},${connection.escape(questionData.userId)} )`

    try {
        connection.query(`SELECT * FROM questions WHERE LOWER(question)=LOWER(${connection.escape(questionData.question)})`,
            async (error, result) => {
                if(result.length) {
                    return res.status(409).send({
                        message:'This question already exists!'
                    });
                }

                connection.query(query)
                await res.status(201).send ({
                    message: "Question created!"
                })
            }
        )
    } catch (error) {
        res.status(400).send({
            message:"Did not create question. Did you input a valid question?"
        })
    }

});

module.exports = router;
