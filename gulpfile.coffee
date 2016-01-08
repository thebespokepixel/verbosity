gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
vows = require 'gulp-vows'
git = require 'gulp-git'
util = require 'util'
pkg = require './package.json'
semverRegex = require 'semver-regex'
exec = require('child_process').exec

gulp.task 'compile', (cb) ->
	gulp.src './src/**/*.coffee'
		.pipe coffee
			bare: true
		.on 'error', (err) ->
			cb err
		.pipe gulp.dest './'
	do cb

gulp.task 'test', ['compile'], ->
	gulp.src './test/*.coffee'
		.pipe coffee
			bare: true
		.pipe vows
			reporter: 'spec'

gulp.task 'post-checkout', (cb) ->
	git.status
		args : '--porcelain --branch',
		(err_, stdout_) ->
			unless err_
				if version = semverRegex().exec(stdout_)?[0]
					unless version is pkg.version
						gutil.log "Setting package to #{version}"
						exec "npm version #{version}", (err, stdout, stderr) ->
							unless err
								gulp.src './package.json'
								  .pipe do git.add
								  .pipe git.commit "Setting version to #{version}"
								do cb
							else
								cb err
					else
						gutil.log "Package version already set"
						do cb
			else
				cb err_

gulp.task 'default', ['compile']
