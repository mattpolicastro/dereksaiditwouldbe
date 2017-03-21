// Borrows heavily: https://github.com/sogko/gulp-recipes/blob/master/browser-sync-nodemon-expressjs/gulpfile.js
'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const jsdoc2md = require('jsdoc-to-markdown');
const bs = require('browser-sync');

const DOCS_DICT = require(path.join(__dirname, 'src/config/docs_dict'));
const BS_DELAY = 1500;

gulp.task('nodemon', () => {
  return nodemon({
    script: 'src/app.js',
    watch: ['src/app.js', 'src/*', 'src/config/*', 'src/models/*', 'src/routes/*', 'src/views/*'],
    ext: 'js hbs',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('bs-nodemon', (next) => {
  let called = false;

  return nodemon({
    script: 'src/app.js',
    watch: ['src/app.js', 'src/config/*', 'src/models/*', 'src/routes/*', 'src/views/*'],
    ext: 'js hbs',
    env: { 'NODE_ENV': 'development' }
  }).on('start', () => {
    if (!called) { setTimeout(() => {
      next();
    }, BS_DELAY); }
    called = true;
  }).on('restart', () => {
    bs.notify('Restarting nodemon');
    setTimeout(() => {
      bs.reload();
    }, BS_DELAY);
  });
});

gulp.task('bs', ['bs-nodemon'], () => {
  bs({
    browser: 'safari technology preview',
    notify: false,
    proxy: 'http://localhost:3000',
    port: 4000
  });
});

gulp.task('bs-reload', () => {
  bs.reload();
});

gulp.task('compile-docs', () => {
  jsdoc2md.render({ files: 'src/routes.js' }).then((data) => {
    for (const dict of DOCS_DICT) {
      data = data.replace(dict.regex, dict.replacement);
    }
    return fs.writeFileSync('REST.md', data, 'utf8');
  });
});

gulp.task('compile-sass', () => {
  let input = 'src/public/sass/*.scss';
  let output = 'src/public/css';
  return gulp
    .src(input)
    // Process Sass files
    .pipe(sass())
    // Init sourecmapping
    .pipe(sourcemaps.init())
    // Minify output
    .pipe(cleanCSS())
    // Write souremaps to same dest
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(output));
});

gulp.task('default', ['nodemon', 'compile-docs', 'compile-sass'], () => {
  gulp.watch('src/public/sass/*', ['compile-sass']);
});

gulp.task('dev', ['bs'], () => {
  gulp.watch('src/public/sass/*', ['compile-sass', 'bs-reload']);
});
