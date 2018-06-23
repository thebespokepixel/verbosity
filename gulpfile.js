'use strict'
/*
 *  Client Gulp File
 */

const gulp = require('gulp')
const rename = require('gulp-rename')
const strip = require('gulp-strip-comments')
const rollup = require('gulp-better-rollup')
const babel = require('rollup-plugin-babel')

const external = ['util', 'console', 'term-ng', 'chalk', 'sparkles', '@thebespokepixel/time', '@thebespokepixel/meta']

const babelConfig = {
	presets: [
		['@babel/preset-env', {
			modules: false,
			targets: {
				node: '8.0.0'
			}
		}]
	],
	exclude: 'node_modules/**'
}

gulp.task('cjs', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			format: 'cjs'
		}))
		.pipe(strip())
		.pipe(gulp.dest('.'))
)

gulp.task('es6', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			format: 'es'
		}))
		.pipe(strip())
		.pipe(rename('index.mjs'))
		.pipe(gulp.dest('.'))
)

gulp.task('default', gulp.series('cjs', 'es6'))
// const cordial = require('@thebespokepixel/cordial')()

// // transpilation/formatting
// gulp.task('bundle', cordial.macro({
// 	source: 'src/index.js'
// }).bundle())

// gulp.task('master', cordial.macro({
// 	master: true,
// 	source: 'src/index.js'
// }).bundle())

// // Clean
// gulp.task('clean', cordial.shell({
// 	source: ['npm-debug.log', './nyc_output', './coverage']
// }).trash())

// // Docs
// gulp.task('docs', cordial.shell({
// 	source: 'npm run doc-build'
// }).job())

// // ReadMe
// gulp.task('readme', cordial.shell({
// 	source: 'npm run readme'
// }).job())

// // Tests
// gulp.task('ava', cordial.test().ava(['test/*.js']))
// gulp.task('xo', cordial.test().xo(['src/*.js']))
// gulp.task('test', gulp.parallel('xo', 'ava'))

// // Hooks
// gulp.task('start-release', gulp.series('reset', 'clean', 'master', 'readme'))
// gulp.task('post-flow-release-start', gulp.series('start-release', 'version-release', 'docs', 'commit'))

// // Default
// gulp.task('default', gulp.series('bump', 'clean', gulp.parallel('docs', 'bundle', 'readme')))
