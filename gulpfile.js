'use strict'
/*
 *  Client Gulp File
 */

const gulp = require('gulp')
const rename = require('gulp-rename')
const rollup = require('gulp-better-rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')

const external = id => !id.startsWith('src') && !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0')

const babelConfig = {
	presets: [
		['@babel/preset-env', {
			modules: false,
			targets: {
				node: '8.0.0'
			}
		}]
	],
	comments: false,
	exclude: 'node_modules/**'
}

gulp.task('cjs', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			external,
			plugins: [resolve(), commonjs(), babel(babelConfig)]
		}, {
			format: 'cjs'
		}))
		.pipe(gulp.dest('.'))
)

gulp.task('es6', () =>
	gulp.src('src/index.js')
		.pipe(rollup({
			external,
			plugins: [resolve(), commonjs(), babel(babelConfig)]
		}, {
			format: 'es'
		}))
		.pipe(rename('index.mjs'))
		.pipe(gulp.dest('.'))
)

gulp.task('default', gulp.series('cjs', 'es6'))
