const iban = require("./js/iban.js");
const mysql = require("mysql");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 4000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  debug: false,
});

app.get("/", function (req, res) {
  console.log(req);
  pool.query(
    `SELECT * FROM ${process.env.DATABASE_NAME}.bank_account ORDER BY id desc LIMIT 5`,
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

      return res.status(200).json(result);
    }
  );
});

app.post("/validate", (req, res) => {
  try {
    let validation = iban.validate(req.body.iban);
    return res.status(200).json(validation);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
