const express = require('express')
const userRouter = require('./routers/users/users');
const questionRouter = require('./routers/questions/questions');

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(questionRouter)

module.exports = app