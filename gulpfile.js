// Borrows heavily: https://github.com/sogko/gulp-recipes/blob/master/browser-sync-nodemon-expressjs/gulpfile.js
'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jsdoc2md = require('jsdoc-to-markdown');
const docsDict = require(path.join(__dirname, 'src/config/docs_dict'));

gulp.task('nodemon', () => {
  return nodemon({
    script: 'src/app.js',
    watch: ['src/app.js', 'src/*', 'src/config/*', 'src/models/*', 'src/routes/*', 'src/views/*'],
    ext: 'js hbs',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('compile-docs', () => {
  jsdoc2md.render({ files: 'src/routes.js' }).then((data) => {
    for (const dict of docsDict) {
      data = data.replace(dict.regex, dict.replacement);
    }
    return fs.writeFileSync('REST.md', data, 'utf8');
  });
});

gulp.task('default', ['nodemon', 'compile-docs']);
