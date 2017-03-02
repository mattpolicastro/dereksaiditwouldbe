'use strict';

module.exports = [
  { regex: /getAll(\(\))?/g, replacement: 'GET /historical/' },
  { regex: /getDate(\(\))?/g, replacement: 'GET /historical/' },
  { regex: /post(\(\))?/g, replacement: 'POST /historical/' },
  { regex: /deleteDate(\(\))?/g, replacement: 'DELETE /historical/' },
  { regex: /getForecast(\(\))?/g, replacement: 'GET /forecast/' }
];
