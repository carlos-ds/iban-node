require("dotenv").config();

const iban = require("./js/iban.js");
const mysql = require("mysql");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
<<<<<<< HEAD
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
	extended: true
}));
=======
const port = process.env.PORT || 3306;
const environment = process.env.NODE_ENV || "dev";

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.APPLICATION_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
>>>>>>> develop

const pool = mysql.createPool({
	connectionLimit: 100,
	host: process.env.DATABASE_HOSTNAME,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	debug: false
});

app.get("/", function (req, res) {
<<<<<<< HEAD
	pool.query(`SELECT * FROM ${process.env.DATABASE_NAME}.bank_account ORDER BY id desc LIMIT 10`, function (err, result, fields) {
		if (err) {
			return res.json({ error: true, message: err });
		}

		res.render("index", { data: result });
	});
});

app.get("/create", function (req, res) {
	let newIban = iban.generateIban();
	pool.query(`INSERT INTO ${process.env.DATABASE_NAME}.bank_account (value, format, country) VALUES (?, ?, ?)`, [newIban, "IBAN", "BE"], function (err, result, fields) {
		if (err) {
			return res.json({ error: true, message: err });
		}

		res.redirect("/");
	});
});


app.get("/validate", (req, res) => {
	res.render("validate");
});

app.post("/validate", (req, res) => {
	let validation = iban.validate(req.body.iban);
	console.log(validation);
	res.render("validate", { validation });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
=======
  let limit = parseInt(req.query.limit, 10);

  if (!limit || limit <= 0) {
    limit = 1;
  }

  pool.query(
    `SELECT * FROM ${process.env.DATABASE_NAME}.bank_account ORDER BY id desc LIMIT ${limit}`,
    function (err, result, fields) {
      if (err) {
        return res.status(500).send(err);
      }

      return res.status(200).json(result);
    }
  );
});

app.get("/create", function (req, res) {
  let newIban = iban.generateIban();
  pool.query(
    `INSERT INTO ${process.env.DATABASE_NAME}.bank_account (value, format, country) VALUES (?, ?, ?)`,
    [newIban, "IBAN", "BE"],
    function (err, result, fields) {
      if (err) {
        return res.status(500).send(err);
      }

      return res.redirect("/?limit=5");
    }
  );
});

app.post("/validate", (req, res) => {
  try {
    let validation = iban.validate(req.body.accountNumber);
    return res.status(200).json(validation);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.listen(port, () =>
  console.log(`Port: ${port}\nEnvironment: ${environment}`)
);
>>>>>>> develop
