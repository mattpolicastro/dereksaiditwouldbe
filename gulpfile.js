// Adapted from: https://github.com/sogko/gulp-recipes/blob/master/browser-sync-nodemon-expressjs/gulpfile.js
'use strict';

// Core
const fs          = require('fs');
const path        = require('path');
// npm
const babelify    = require('babelify');
const browserSync = require('browser-sync');
const browserify  = require('browserify');
const gulp        = require('gulp');
const css         = require('gulp-clean-css');
const nodemon     = require('gulp-nodemon');
const sass        = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');
const jsdoc       = require('jsdoc-to-markdown');
const vueify      = require('vueify');

const BROWSER_SYNC_DELAY    = 1000;
const NODEMON_RESTART_DELAY = 5000;

const DOCS_DICT = require(path.resolve(__dirname, 'src/config/docs_dict'));

const VIEWS_PATH  = 'src/views/';
const PUBLIC_PATH = 'src/public/';

const STYLES_GLOB = VIEWS_PATH + 'styles/*.scss';
const SERVER_RESTART_GLOBS = [
  'src/app.js',
  'src/routes.js',
  'src/config/**.js',
  'src/views/**.hbs'
];

gulp.task('compile-docs', (done) => {
  jsdoc.render({ files: path.resolve(__dirname, 'src/routes.js') }).then((data) => {
    for (const dict of DOCS_DICT) {
      data = data.replace(dict.regex, dict.replacement);
    }
    fs.writeFileSync('REST.md', data, 'utf8');
  });

  done();
});

// Compile JS with Browserify
gulp.task('compile-js', (done) => {
  browserify(VIEWS_PATH + 'vue.js')
    .transform(vueify)
    .transform(babelify, { presets: [ 'es2015' ]})
    .bundle()
    .pipe(fs.createWriteStream(PUBLIC_PATH + 'js/bundle.js'));

  done();
});

// Compile JS with Webpack.
// Miserably broken and I have no idea why. Leaving commented in the hope of solving later.
// http://stackoverflow.com/questions/42964474/gulp-webpack-not-transpiling-vue-files
// gulp.task('compile-js', (done) => {
//   // Use webpack to transpile, bundle, and uglify front-end JS
//   gulp.src(path.join(__dirname, VIEWS_PATH + 'vue.js'))
//     .pipe(webpack(require(path.join(__dirname, 'webpack.config.js'))))
//     .pipe(gulp.dest(path.join(__dirname, PUBLIC_PATH + 'js')));
//
//   done();
// });

gulp.task('compile-sass', (done) => {
  let input = STYLES_GLOB;
  let output = PUBLIC_PATH + 'css';
  gulp
    .src(input)
    // Process Sass files
    .pipe(sass())
    // Init sourecmapping
    .pipe(sourcemaps.init())
    // Minify output
    .pipe(css())
    // Write souremaps to same dest
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(output));

  done();
});

gulp.task('nd', (done) => {
  let stream = nodemon({
    // Init nodemon with the server file
    script: path.resolve(__dirname, 'src/app.js'),
    watch: SERVER_RESTART_GLOBS
  }).on('restart', () => {
    // Log restart and trigger a browserSync reload after a wait
    console.log('Restarted!');
    reloadBrowser();
  }).on('crash', () => {
    // Log crash and restart the app after a wait
    console.error('Crashed!');
    stream.emit('restart', NODEMON_RESTART_DELAY);
  });

  done();
});

gulp.task('bs', gulp.series('nd', function browserSyncOpen(done) {
  // Start browserSync proxy and open browser after a wait
  setTimeout(() => {
    browserSync.init({
      port: 5000,
      proxy: 'localhost:3000'
    });
  }, BROWSER_SYNC_DELAY);

  done();
}));

gulp.task('bs-reload', (done) => {
  reloadBrowser();
  done();
});

gulp.task('default', gulp.series(gulp.parallel('compile-js', 'compile-sass', 'compile-docs'), 'bs', function setUpWatchers(done) {
  gulp.watch(STYLES_GLOB, gulp.series('compile-sass', 'bs-reload'));
  gulp.watch('src/routes.js', gulp.series('compile-docs', 'bs-reload'));
  // gulp.watch(BROWSER_RESTART_GLOBS, gulp.task('bs-reload'));
  gulp.watch([VIEWS_PATH + 'vue.js', VIEWS_PATH + '**/*.vue'], gulp.series('compile-js', 'bs-reload'));

  done();
}));

function reloadBrowser() {
  return setTimeout(() => {
    browserSync.reload();
  }, BROWSER_SYNC_DELAY);
}
