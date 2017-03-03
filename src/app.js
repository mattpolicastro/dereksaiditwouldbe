'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const apiRouter = require(path.join(__dirname, 'routes'));

const hbscfg = require(path.join(__dirname, 'config/handlebars'));

const port = 3000;
const app = express();
const docs = fs.readFileSync(path.join(__dirname, '../REST.md'), { encoding: 'utf8' });


// Add the JSON body parser
app.use(bodyParser.json());

// Add Handlebars as the view engine
let hbs = exphbs.create(hbscfg);
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Enable view caching
app.enable('view cache');

app.get('/', (req, res) => {
  res.render('index', { contents: docs });
});

// Mount the router for the API endpoints
app.use('/', apiRouter);

// Return 404 for all others
app.get('*', (req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log('Now listening on port %s!', port);
});
