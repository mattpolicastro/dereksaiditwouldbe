'use strict';

const path = require('path');
const handlebars = require('handlebars');
const marked = require('marked');

module.exports = {
  // Set the default file extension
  extname: '.hbs',
  // Define the default layout
  defaultLayout: 'main',
  // Define global helpers
  helpers: {
    // Render markdown
    marked: function(string) {
      let markedString = string || '';
      return new handlebars.SafeString(marked(markedString));
    }
  },
  // Define the special dirs for layouts and partials
  layoutsDir: path.join(__dirname, '../views/hbs-layouts'),
  partialsDir: path.join(__dirname, 'src/views/hbs-partials')
};
