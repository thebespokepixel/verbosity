'use strict'
/*
 *  Client Gulp File
 */

const gulp = require('gulp')
const cordial = require('@thebespokepixel/cordial')()

// transpilation/formatting
gulp.task('bundle', cordial.macro({
	source: 'src/index.es6'
}).bundle())

gulp.task('master', cordial.macro({
	master: true,
	source: 'src/index.es6'
}).bundle())

// Tests
gulp.task('ava', cordial.test().ava(['test/*.js']))
gulp.task('xo', cordial.test().xo(['src/*.es6']))
gulp.task('test', gulp.parallel('xo', 'ava'))

gulp.task('post-flow-release-start', gulp.series('reset', 'master', 'version-release'))
gulp.task('post-flow-release-finish', gulp.series('test', 'publish', 'push-force'))

// Default
gulp.task('default', gulp.series('bump', 'bundle'))
