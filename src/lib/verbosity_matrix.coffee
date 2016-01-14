'use strict'
###
	verbosity
	Message Logging Priority Matrix
###
format = require('util').format
inspect = require('util').inspect
in_color = require('term-ng').color.level ? false
chalk = require 'chalk'

class VerbosityMatrix extends console.Console
	constructor: (options_) ->
		{ out, error, verbosity, timestamp } = options_

		out ?= process.stdout
		error ?= out

		unless out.writable
			throw new Error 'Provided output stream must be writable'
		unless error.writable
			throw new Error 'Provided error stream must be writable'

		super out, error

		if timestamp?
			dateformat = require 'dateformat'
			@timestamp = -> "[#{chalk.dim(dateformat timestamp)}] "
		else
			@timestamp = -> ''

		@threshold = verbosity ? 3
		@outStream = out
		@errorStream = error

	verbosity: (level_) =>
		@threshold = level_ if 0 < level_ < 6
		@threshold

	canWrite: (level_) =>
		@threshold >= level_

	debug: (msg, args...) =>
		if @threshold > 4
			msg = format(msg, args...) if typeof msg is 'string' and args?
			@outStream.write "#{@timestamp()}#{chalk.dim(msg)}\n"
		return

	info: (msg, args...) =>
		if @threshold > 3
			msg = format(msg, args...) if typeof msg is 'string' and args?
			@outStream.write "#{@timestamp()}#{msg}\n"
		return

	log: (msg, args...) =>
		if @threshold > 2
			msg = format(msg, args...) if typeof msg is 'string' and args?
			@outStream.write "#{@timestamp()}#{msg}\n"
		return

	warn: (msg, args...) =>
		if @threshold > 1
			msg = format(msg, args...) if typeof msg is 'string' and args?
			@errorStream.write "#{@timestamp()}#{chalk.yellow(msg)}\n"
		return

	error: (msg, args...) =>
		if @threshold > 0
			msg = format("ERROR:", msg, args...)
			@errorStream.write "#{@timestamp()}#{chalk.red(msg)}\n"
		return

	critical: (msg, args...) =>
		if @threshold > 0
			msg = format("CRITICAL:", msg, args...)
			@errorStream.write "#{@timestamp()}#{chalk.bold.red(msg)}\n"
		return

	panic: (msg, args...) -> @critical msg, args...
	emergency: (msg, args...) -> @critical msg, args...

	dir: (obj, options) ->
		options ?= {}
		options.depth ?= 0
		options.color ?= in_color
		super obj,
			depth: options.depth
			colors: options.color
		return obj

	trace: (obj, title="") ->
		@dir obj,
			depth: 5
		@error "Line: #{obj.line}", "Column: #{obj.column}", title
		super obj
		return

	pretty: (obj, descend = 0) ->
		formatted = inspect obj,
			depth: descend
			colors: in_color
		@outStream.write format "Content: %s\n", formatted[..-2].
			replace(/^{/, 'Object\n ').
			replace(/^\[/, 'Array\n ').
			replace(/^(\w+) {/, '$1').
			replace(/:/g, ' ▸').
			replace /,\n/g, '\n'

	yargs: (obj) ->
		parsed = {}
		for key, val of obj
			switch key
				when '_'
					parsed.arguments = val.join ' ' if val.length > 0
				when '$0'
					parsed.self = val
				else
					if key.length > 1
						parsed[key] = val

		formatted = inspect parsed,
			colors: in_color

		@outStream.write format "Options (yargs):\n  %s\n", formatted[2..-2].replace(/:/g, ' ▸').replace /,\n/g, '\n'

module.exports = VerbosityMatrix
