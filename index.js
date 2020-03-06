const express = require('express');
const Promise = require('bluebird');
const sqlite = require('sqlite');
const dbUtils = require('./src/db');

const app = express();
const port = process.env.PORT || 3000;
const dbPromise = sqlite.open('./database.sqlite', { Promise });

dbUtils.initDb(dbPromise) // import precious-data into sqlite

app.get('/number/:id', async (req, res, next) => {
  try {
    const db = await dbPromise;
    const [cards] = await Promise.all([
      db.get('SELECT * FROM cards WHERE number = ?', req.params.id)
    ]);
    console.log(cards.length)
    res.send(cards);
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`  api listening on port ${port}`);
});
