const iban = require('./js/iban.js');
const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: process.argv[2],
    database: 'personal',
    debug: false
  });

app.get('/', function (req, res) {
    pool.query('SELECT * FROM iban ORDER BY id desc LIMIT 10', function(err, result, fields){
        if(err) {
            return res.json({'error': true, 'message': err});
        }

        res.render('index', { data: result });
    });
});

app.get('/create', function(req, res) {
    let newIban = iban.generate();
    pool.query(`INSERT INTO iban (iban) VALUES (?)`, [newIban], function(err, result, fields){
        if(err) {
            return res.json({'error': true, 'message': err});
        }

        res.redirect('/');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));