'use strict';

const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');

// Initialise the database connector and export for use in router functions
const db = require('knex')({
  client: 'sqlite3',
  connection: { filename: path.join(__dirname, '../daily.db') },
  useNullAsDefault: true
});

// Read data in from source file
fs.readFile(path.join(__dirname, '../daily_pred.csv'), (err, file) => {
  if (err) throw err;
  parse(file, { columns: true }, (err, data) => {
    if (err) throw err;
    db('weather').truncate().then(() => {
      db.batchInsert('weather', data, 100).then(() => {
        console.log('Database successfully reinitalised');
      }).catch((err) => {
        throw err;
      });
    });
  });
});

module.exports = db;
