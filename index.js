const iban = require('./js/iban.js');
const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');

const app = express();
const port = 3000;

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: process.argv[2],
    database: 'personal',
    debug: false
  });

app.get('/', function (req, res) {
    pool.query('SELECT * FROM iban', function(err, results, fields){
        if(err) {
            return res.json({'error': true, 'message': err});
        }

        res.json(results);
    });
});

app.get('/create', function(req, res) {
    let newIban = iban.generate();
    pool.query(`INSERT INTO iban (iban) VALUES (?)`, [newIban], function(err, results, fields){
        if(err) {
            return res.json({'error': true, 'message': err});
        }

        res.redirect('/');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));