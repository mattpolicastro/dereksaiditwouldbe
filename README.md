# CS 6065 Homework #2

Simple RESTful API for weather data, written in Node.js. Accessible here, with documentation available at the [homepage](http://dereksaiditwouldbe.ddns.net) and in REST.md. The app uses:

* [Express](http://expressjs.com) for web application and routing
* [Prophet](https://www.npmjs.com/package/nostradamus) for time-series forecasting
* [Gulp](http://gulpjs.com) for build tasks and developer ergonomics
* [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) for documentation generation

## Running app

The app reads pre-calculated predictions and historical data and re-initalises a sqlite database on launch. Modifications (e.g. insertions or deletions) are persisted until application restart.

### Locally

To run the app, install all dependencies and then simply run `gulp` to compile the API docs and start the app.

    $ npm install
    $ gulp

### AWS

To launch the app on AWS, configure your computer with necessary AWS CLI keys and change the settings as needed in ansible/config.json.

    $ ansible-playbook ansible/ec2_launch.yml --extra-vars=@ansible/config.json

## To-Do & Miscellanea

* Ansible is running into problems with installing the sqlite3 npm library, apparently from the node-gyp build process. As such, dependencies will need to be manually installed via `npm install` on the first run.
* Predictions on the dataset need to be performed manually by running `predict.py`.
