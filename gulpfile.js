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
