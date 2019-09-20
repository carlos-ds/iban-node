const iban = require("./js/iban.js");
const mysql = require("mysql");
const express = require("express");
const ejs = require("ejs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
	connectionLimit: 100,
	host: process.env.DATABASE_HOSTNAME,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	debug: false
});

app.get("/", function(req, res) {
	pool.query(`SELECT * FROM ${process.env.DATABASE_NAME}.bank_account ORDER BY id desc LIMIT 10`, function(err, result, fields) {
		if (err) {
			return res.json({ error: true, message: err });
		}

		res.render("index", { data: result });
	});
});

app.get("/create", function(req, res) {
	let newIban = iban.generate();
	pool.query(`INSERT INTO ${process.env.DATABASE_NAME}.bank_account (value, format, country) VALUES (?, ?, ?)`, [newIban, "IBAN", "BE"], function(err, result, fields) {
		if (err) {
			return res.json({ error: true, message: err });
		}

		res.redirect("/");
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
