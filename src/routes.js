'use strict';

const path = require('path');
const router = require('express').Router();
const axios = require('axios');
const moment = require('moment-timezone');
// Had tried to use .from('weather') here to prevent repetition, but doing so
// would lead to odd behaviour where queries would persist between requests

const db = require(path.join(__dirname, 'config/knex'));

const DARKSKY_KEY = '5572cfc4e29fe31a8d3289eb4ded07eb';
const CIN_LAT  =  39.1015;
const CIN_LONG = -84.5125;

/**
 * Representation of maximum and minimum temperatures for a date.
 */
class DateTemps {
  /**
   * Create a DateTemps.
   * @param {number} date - The given date in YYYYMMDD format.
   * @param {number} max - The maximum temperature for this date.
   * @param {number} min - The minimum temperature for this date.
   */
  constructor(date, max, min) {
    this.DATE = date;
    this.TMAX = max;
    this.TMIN = min;
  }
}

router.get('/historical', getAll);
/**
 * GET all available data
 * @return {array} An array of all available dates (not DateTemps).
 */
function getAll(req, res) {
  db.from('weather').select('DATE').then((rows) => {
    res.json(rows);
  }).catch((err) => {
    res.status(500).send(err);
  });
}

router.get('/historical/:date', getDate);
/**
 * GET available data for given date
 * @param {number} date - Requested date in YYYYMMDD format.
 * @return {DateTemps} Temperature data for the requested date.
 */
function getDate(req, res) {
  db.from('weather').select().where('DATE', req.params.date).then((rows) => {
    if (rows.length === 0) {
      res.status(404).send('No data found for this date.');
    } else {
      res.json(new DateTemps(rows[0].DATE, rows[0].TMAX, rows[0].TMIN));
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
}

router.post('/historical', post);
/**
 * POST new data for given date
 * @param {DateTemps} date - DateTemps object containing new data.
 * @return {object} Object with new date key/value.
 */
function post(req, res) {
  let data = req.body;
  db('weather').select().where('DATE', data.DATE).then((rows) => {
    if (rows.length === 0) {
      db('weather').insert({
        Date: String(data.DATE),
        TMAX: Number(data.TMAX),
        TMIN: Number(data.TMIN)
      }).then(() => {
        res.status(201).json({ DATE: data.DATE });
      }).catch((err) => {
        res.status(500).send(err);
      });
    } else {
      db('weather').where('DATE', data.DATE).update({
        TMAX: data.TMAX,
        TMIN: data.TMIN
      }).then(() => {
        res.status(201).json({ DATE: data.DATE });
      }).catch((err) => {
        res.status(500).send(err);
      });
    }
  });
}

router.delete('/historical/:date', deleteDate);
/**
 * DELETE data for given date
 * @param {number} date - The given date to be deleted.
 * @return {object} Information regarding records deleted.
 */
function deleteDate(req, res) {
  db('weather').where('DATE', req.params.date).del().then((count) => {
    res.status(200).json({'Records deleted': count});
  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
}

router.get('/forecast/:date', getForecast);
/**
 * GET a week's forecasted data from the given date
 * @param {date} date - Date to begin 7-day forecast from.
 * @return {array} Array of DateTemps objects for forecast.
 */
function getForecast(req, res) {
  if (isNaN(req.params.date)) {
    res.status(400).send('Not a valid date. Please use YYYYMMDD format.');
  } else {
    db('weather').select('rowid', '*').where('DATE', req.params.date).then((rows) => {
      if (rows.length === 0) {
        res.status(404).send('Date outside viable prediction range.');
      } else {
        let currentRow = rows[0].rowid;
        db('weather').select().whereBetween('rowid', [currentRow, currentRow + 6]).then((rows) => {
          let result = rows.map((date) => {
            return new DateTemps(date.DATE, date.TMAX_PRED, date.TMIN_PRED);
          });
          res.send(result);
          return;
        }).catch((err) => {
          res.status(500).send(err);
        });
      }
    }).catch((err) => {
      res.status(500).send(err);
    });
  }
}

// Undocumented route for fetching DarkSky data with no safety checking.
// Routing through the server because I didn't want to be messing with
// API keys on the client browser.
router.get('/darksky/:date', getDarkSky);
function getDarkSky(req, res) {
  let reqDate = moment(req.params.date).tz('America/New_York');

  axios(`https://api.darksky.net/forecast/${DARKSKY_KEY}/${CIN_LAT},${CIN_LONG},${reqDate.format()}`)
    .then((ax_res) => {
      res.send(ax_res.data.daily.data[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
}

module.exports = router;
