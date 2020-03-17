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

  await db.run("DROP TABLE IF EXISTS cards");
  await db.run("CREATE TABLE cards (rarity TEXT, setName TEXT, name TEXT, type TEXT, usageCost TEXT, outbreakCost TEXT, color TEXT, characteristic TEXT, ap TEXT, dp TEXT, parallel TEXT, text TEXT, flavor TEXT, image TEXT, url TEXT, setAbbr TEXT, release TEXT, number TEXT, num TEXT, variation TEXT, id TEXT)"); // init

  console.log(`  adding ${cardJsons.length} cards to database...`);
  for (const card of cardJsons) {
    await db.run(SQL`
      INSERT
      INTO cards
        (rarity, setName, name, type, usageCost, outbreakCost, color, characteristic, ap, dp, parallel, text, flavor, image, url, setAbbr, release, number, num, variation, id)
      VALUES (${card.rarity}, ${card.setName}, ${card.name}, ${card.type}, ${card.usageCost}, ${card.outbreakCost}, ${card.color}, ${card.characteristic}, ${card.ap}, ${card.dp}, ${card.parallel}, ${card.text}, ${card.flavor}, ${card.image}, ${card.url}, ${card.setAbbr}, ${card.release}, ${card.number}, ${card.num}, ${card.variation}, ${card.id} )`
    );
  }
  console.log('  card adding complete.')


}

module.exports = {
  initDb
};
