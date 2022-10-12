const express = require('express');
const router = new express.Router();
const connection = require('../../db/mysql');
const userMiddleware = require('../../middleware/validation');
const bodyParser = require('body-parser');
const url = require('url');
const { Console } = require('console');

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
                    message: `Question created by ${questionData.userId}!`
                })
            }
        )
    } catch (error) {
        res.status(400).send({
            message:"Did not create question. Did you input a valid question?"
        })
    }

});

router.get('/api/v1/questions/me', userMiddleware.auth, (req, res) => {
    const query = `SELECT question, DATE_FORMAT(createdAt,'%D %W %M %T') AS Date FROM questions WHERE userId=${req.userData.userId} ORDER BY Date DESC`

    try {
        connection.query(query, (error, result) => {
            if(result){
                return res.status(200).send ({
                    questions: result
                })
            }
            else {
                return res.status(200).send ({
                    message:"You have no questions."
                })
            }
        })
       
    } catch (error) {
        res.status(400).send({
            message:"Did not create question. Did you input a valid question?"
        })
    }

});



router.get('/api/v1/questions/:id',(req, res) => {
    const query = `SELECT id AS questionId, userId, question, DATE_FORMAT(createdAt,'%D %W %M %T') AS Date FROM questions WHERE id=${req.params.id} ORDER BY Date DESC`

    try {
        connection.query(query, (error, result) => {
            if(result.length > 0){
                return res.status(200).send ({
                    questions: result
                })
            }
            else {
                return res.status(404).send ({
                    message:"Question not found."
                })
            }
        })
       
    } catch (error) {
        res.status(404).send({
            message:"Question not found."
        })
    }

});




router.get('/api/v1/questions' ,(req, res) => {
    const query = `SELECT id AS questionId, userId, question, DATE_FORMAT(createdAt,'%D %W %M %T') AS createdAt, DATE_FORMAT(updatedAt,'%D %W %M %T') AS updatedAt FROM questions ORDER BY createdAt DESC`

    try {
        connection.query(query, (error, result) => {
            if(result.length > 0 ){
                return res.status(200).send ({
                    questions: result
                })
            }
           else {
           
                return res.status(200).send ({
                    message:"You have no questions."
                })
            
           }
        })
       
    } catch (error) {
        res.status(200).send({
            message:"No questions yet."
        })
    }

});

router.put('/api/v1/questions/:id',  userMiddleware.auth, userMiddleware.validateQuestion, async (req, res) => {
    var updatedQuestion = req.body.question
    var currentUser = req.userData.userId
    const query = `UPDATE questions SET question = "${updatedQuestion}" WHERE id = ${req.params.id} AND userId = ${currentUser}`
    try {
        connection.query (query, async (error, result) =>{
            if(result.affectedRows > 0){
                await res.status(200).send ({
                    message: "Question updated!",
                    questionId: req.params.id,
                    question: updatedQuestion,
               })
            }
            else {
                await res.status(404).send({
                    message: "Not found."
                })
            }
            
        })
        
    } catch (error) {
        await res.status(404).send({
            message: "Not found."
        })
    }
        
})


router.delete('/api/v1/questions/:id',  userMiddleware.auth, async (req, res) => {
    var currentUser = req.userData.userId
    const query = `DELETE FROM questions WHERE id = ${req.params.id} AND userId = ${currentUser}`
    try {
        connection.query (query, async (error, result) =>{
            if(result.affectedRows > 0){
                await res.status(200).send ({
                    message: `Question ${req.params.id} has been deleted!`,
               })
            }
            else {
                await res.status(404).send({
                    message: "Not found."
                })
            }
            
        })
        
    } catch (error) {
        await res.status(404).send({
            message: "Not found."
        })
    }
        
})


// router.get('/api/v1/questions',(req, res) => {
//     var searchTerm = req.query.question
//     console.log(searchTerm)
//     const query = `SELECT userId, question, DATE_FORMAT(createdAt,'%D %W %M %T') AS Date FROM questions WHERE question LIKE '%${searchTerm}%' ORDER BY Date DESC`
  
//         connection.query(query, (error, result) => {
//             if(result.length > 0 ){
//                 return res.status(200).send ({
//                     questions: result
//                 })
//             }
//            else {
           
//                 return res.status(200).send ({
//                     message:"No related questions."
//                 })
            
//            }
//         })

// });

module.exports = router;
