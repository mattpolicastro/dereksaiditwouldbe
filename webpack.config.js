'use strict';

// Core
const path = require('path');
// npm
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src/views/vue.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src/public/js')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader' ,
        // This insane nesting is to transpile ES6 in Vue templates before being sent to UglifyJS
        options: {
          loaders: {
            js: 'buble-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'buble-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  watch: true
};
