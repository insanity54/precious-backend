/**
 import precious memories card data from precious-data submodule into the sqlite database.
*/

const globby = require('globby');
const Promise = require('bluebird');
const SQL = require('sql-template-strings');

const initDb = async (dbPromise) => {
  const cardJsonPaths = await globby(['../precious-data/data/**/*.json', '!../precious-data/data/setAbbrIndex.json']);
  const cardJsons = await Promise.map(cardJsonPaths, (fileName) => {
    return require(fileName)
  });
  const db = await dbPromise;

  await db.run("CREATE TABLE IF NOT EXISTS cards (number TEXT, rarity TEXT, setName TEXT, name TEXT, type TEXT, usageCost TEXT, outbreakCost TEXT, color TEXT, characteristic TEXT, ap TEXT, dp TEXT, parallel TEXT, text TEXT, flavor TEXT, image TEXT, url TEXT, setAbbr TEXT)"); // init

  console.log(`  adding ${cardJsons.length} cards to database...`);
  for (const card of cardJsons) {
    await db.run(SQL`
      INSERT
      INTO cards
        (number, rarity, setName, name, type, usageCost, outbreakCost, color, characteristic, ap, dp, parallel, text, flavor, image, url, setAbbr)
      VALUES (${card.number}, ${card.rarity}, ${card.setName}, ${card.name}, ${card.type}, ${card.usageCost}, ${card.outbreakCost}, ${card.color}, ${card.characteristic}, ${card.ap}, ${card.dp}, ${card.parallel}, ${card.text}, ${card.flavor}, ${card.image}, ${card.url}, ${card.setAbbr} )`
    );
  }
  console.log('  card adding complete.')


}

module.exports = {
  initDb
};
