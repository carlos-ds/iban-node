require('dotenv').config();

const iban = require('./js/iban.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config.js');
const port = process.env.PORT || 3306;
const environment = process.env.NODE_ENV || 'dev';

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  if (environment === 'dev') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    if (config.allowedOrigins.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://iban-generator.be');
    }
  }
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Vary', 'Origin');
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// From the official Express documentation: "If you don’t want to use Helmet, then at least disable the X-Powered-By header. Attackers can use this header (which is enabled by default) to detect apps running Express and then launch specifically-targeted attacks."
app.disable('x-powered-by');

// MongoDB connection
const MongoClient = require('mongodb').MongoClient;
const username = encodeURIComponent(process.env.DATABASE_USERNAME);
const password = encodeURIComponent(process.env.DATABASE_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@${process.env.DATABASE_HOSTNAME}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client
  .connect()
  .then(() => {
    app.get('/', async function (req, res) {
      try {
        let limit = parseInt(req.query.limit, 10);
        let createdBy = req.query.createdBy;

        if (!limit || limit <= 0) {
          limit = 1;
        }

        if (!createdBy) {
          createdBy = 'GENERATION';
        }

        const collection = client.db(process.env.DATABASE_NAME).collection('iban');

        collection
          .find({ createdBy: createdBy })
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray((error, documents) => {
            if (error) {
              return res.status(500).json(error);
            }
            return res.status(200).json(documents);
          });
      } catch (err) {
        return res.status(500).json(err);
      }
    });

    app.post('/create', async function (req, res) {
      try {
        const accountNumber = iban.generateIban();
        const collection = client.db(process.env.DATABASE_NAME).collection('iban');

        const userId = req.body.userId;
        const document = {
          accountNumber,
          createdAt: new Date().toISOString(),
          createdBy: 'GENERATION',
          userId
        };
        const result = await collection.insertOne(document);

        console.log(`# documents inserted: ${result.insertedCount}`);

        return res.redirect('/?limit=5');
      } catch (err) {
        return res.status(500).json(err);
      }
    });

    app.post('/validate', async function (req, res) {
      try {
        const validationResult = iban.validate(req.body.accountNumber);
        const userId = req.body.userId;

        if (validationResult.sanitizedIban.length >= 16) {
          const collection = client.db(process.env.DATABASE_NAME).collection('iban');
          const document = {
            accountNumber: validationResult.iban,
            createdAt: new Date().toISOString(),
            createdBy: 'VALIDATION',
            validationResult,
            userId
          };
          const result = await collection.insertOne(document);

          console.log(`# documents inserted: ${result.insertedCount}`);
        }

        return res.status(200).json(validationResult);
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });

    app.listen(port, () => console.log(`Port: ${port}\nEnvironment: ${environment}`));
  })
  .catch((err) => console.log(err));
