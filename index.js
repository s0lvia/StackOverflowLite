const app = require('./app')
const port = process.env.PORT
const jwtSecret = process.env.JWT_SECRET

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})