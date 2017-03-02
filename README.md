# CS 6065 Homework #2

Simple RESTful API for weather data, written in Node.js. Uses:

* [Express](http://expressjs.com) for web application and routing
* [Prophet](https://www.npmjs.com/package/nostradamus) for time-series forecasting
* [Gulp](http://gulpjs.com) for build tasks and developer ergonomics
* [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) for documentation generation

## Running app

To run the app, install all dependencies and then simply run `gulp` to compile the API docs and start the app.

    $ npm install
    $ gulp

The app reads pre-calculated predictions and historical data and re-initalises a sqlite database on launch. Modifications (e.g. insertions or deletions) are persisted until application restart.

## To-Do & Miscellanea

* Ansible is running into problems with installing the sqlite3 npm library, apparently from the node-gyp build process. As such, dependencies will need to be manually installed via `npm install` on the first run.
* Predictions on the dataset need to be performed manually by running `predict.py`.
