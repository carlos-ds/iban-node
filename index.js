require("dotenv").config();

const iban = require("./js/iban.js");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config");
const port = process.env.PORT || 3306;
const environment = process.env.NODE_ENV || "dev";

app.use(function (req, res, next) {
  console.log(req.hostname);
  console.log(req.protocol);
  console.log(config.allowedOrigins);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  if (environment === "dev") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://iban-angular.herokuapp.com/");
  }
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Vary", "Origin");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// From the official Express documentation: "If you don’t want to use Helmet, then at least disable the X-Powered-By header. Attackers can use this header (which is enabled by default) to detect apps running Express and then launch specifically-targeted attacks."
app.disable("x-powered-by");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  debug: false,
});

app.get("/", function (req, res, next) {
  let limit = parseInt(req.query.limit, 10);

  if (!limit || limit <= 0) {
    limit = 1;
  }

  pool.query(`SELECT * FROM ${process.env.DATABASE_NAME}.bank_account ORDER BY id desc LIMIT ${limit}`, function (err, result, fields) {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).json(result);
  });
});

app.get("/create", function (req, res) {
  let newIban = iban.generateIban();
  pool.query(`INSERT INTO ${process.env.DATABASE_NAME}.bank_account (value, format, country) VALUES (?, ?, ?)`, [newIban, "IBAN", "BE"], function (err, result, fields) {
    if (err) {
      return res.status(500).send(err);
    }

    return res.redirect("/?limit=5");
  });
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

app.listen(port, () => console.log(`Port: ${port}\nEnvironment: ${environment}`));
