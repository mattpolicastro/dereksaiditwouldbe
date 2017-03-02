'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require(path.join(__dirname, 'routes'));

const port = 3000;
const app = express();

// Add the JSON body parser
app.use(bodyParser.json());

// Mount the router for the API endpoints
app.use('/', apiRouter);

// Return 404 for all others
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log('Now listening on port %s!', port);
});
