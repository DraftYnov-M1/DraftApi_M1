const express = require('express');
require('dotenv').config()
const app = express();
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors())
app.options('*', cors())

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting db :', err);
        return;
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/articles', (req, res) => {
    pool.query('SELECT * FROM articles', (err, results) => {
        if (err) {
            console.error('not found :', err);
            return;
        }
        res.send({
            data: results,
            succes: true
        });
    })
});

app.listen(process.env.PORT, () => {
    console.log(`server launch on port ${process.env.PORT}`);
});