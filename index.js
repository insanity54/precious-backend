const express = require('express');
const Promise = require('bluebird');
const sqlite = require('sqlite');
const dbUtils = require('./src/db');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const dbPromise = sqlite.open('./database.sqlite', { Promise });

dbUtils.initDb(dbPromise) // import precious-data into sqlite

app.use('/data', express.static(path.join(__dirname, 'precious-data', 'data')));

app.get('/api/v1/number/:number', async (req, res, next) => {
  try {
    const db = await dbPromise;
    const [cards] = await db.all('SELECT * FROM cards WHERE number = ?', req.params.number);
    console.log(cards.length)
    res.send(cards);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/setAbbr/:setAbbr', async (req, res, next) => {
  try {
    const db = await dbPromise;
    const cards = await db.all('SELECT * FROM cards WHERE setAbbr = ?', req.params.setAbbr);
    console.log(cards.length)
    console.log(cards);
    res.send(cards);
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`  api listening on port ${port}`);
});
