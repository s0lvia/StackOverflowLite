const mysql = require('mysql');
const userPassword = process.env.PASSWORD;
const userName = process.env.USERNAME
const host = process.env.HOST;
const db = process.env.DATABASE

const connection = mysql.createConnection({
  host     : host,
  user     : userName,
  password :  userPassword,
  database : db
});

module.exports = connection
