const mysql = require('mysql2/promise');
require('dotenv').config();

const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DATABASE;
const user = process.env.DB_USER;


const pool = mysql.createPool({
    host: host,
    database: database,
    user: user,
    password: password
})

module.exports = pool;