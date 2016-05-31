'use strict'
/*
 *  Client Gulp File
 */

const gulp = require('gulp')
const cordial = require('@thebespokepixel/cordial')()

// transpilation/formatting
gulp.task('bundle', gulp.parallel(cordial.macro({
	source: 'src/index.es6'
}).bundler()))

// Tests
gulp.task('ava', cordial.test().ava(['test/*.js']))
gulp.task('xo', cordial.test().xo(['src/*.es6']))
gulp.task('test', gulp.parallel('xo', 'ava'))

// Default
gulp.task('default', gulp.series('bump', 'bundle'))
