'use strict'
/*
 *  Client Gulp File
 */

const gulp = require('gulp')
const cordial = require('@thebespokepixel/cordial')

// Comtranspilationatting
gulp.task('babel-format', cordial.format.babel(['src/**/*.js'], './'))

// Tests
gulp.task('ava', cordial.test.ava(['test/*.js']))
gulp.task('xo', cordial.test.xo(['**/*.js', '!{lib,node_modules}/**/*', '!index.js']))
gulp.task('test', gulp.series('xo', 'ava'))

// Guppy Hooks
gulp.task('start-release', gulp.series('reset', 'test'))
gulp.task('finish-release', gulp.series('backup'))

// Default
gulp.task('default', gulp.series('bump', 'babel-format'))
