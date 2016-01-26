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
		{ outStream, errorStream, verbosity, timestamp, namespace, prefix } = options_

		outStream ?= process.stdout
		errorStream ?= outStream

		unless outStream.writable
			throw new Error 'Provided output stream must be writable'
		unless errorStream.writable
			throw new Error 'Provided error stream must be writable'

		super outStream, errorStream

		if @emits = namespace?
			sparkles = require 'sparkles'
			@emitter = sparkles namespace

		tstamp = if timestamp?
				dateformat = require 'dateformat'
				-> "[#{chalk.dim(dateformat timestamp)}] "
			else -> ''

		pfix = if prefix?
				-> "[#{prefix}] "
			else -> ''

		@threshold = verbosity ? 3
		@outStream = outStream
		@errorStream = errorStream

		@_levels =
			debug:
				level: 5
				stream: outStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{chalk.dim(msg)}"
			info:
				level: 4
				stream: outStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{msg}"
			log:
				level: 3
				stream: outStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{msg}"
			warn:
				level: 2
				stream: errorStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{chalk.yellow(msg)}"
			error:
				level: 1
				stream: errorStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{chalk.red('ERROR: ' + msg)}"
			critical:
				level: 0
				stream: errorStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{chalk.bold.red('CRITICAL: ' + msg)}"
			panic:
				level: 0
				stream: errorStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{chalk.bold.red('PANIC: ' + msg)}"
			emergency:
				level: 0
				stream: errorStream
				format: (msg) -> "#{do tstamp}#{do pfix}#{chalk.bold.red('EMERGENCY: ' + msg)}"

	_router: (level_, msg, args...) ->
		msg = format(msg, args...) if typeof msg is 'string' and args?
		@emitter.emit(level_, msg) if @emits
		@_levels[level_].stream.write(@_levels[level_].format(msg) + '\n') if @threshold >= @_levels[level_].level
		return

	verbosity: (level_) ->
		level_ = @levels[level_] if typeof level_ is 'string'
		@threshold = level_ if level_ < 6
		@threshold

	canWrite: (level_) ->
		level_ = @levels[level_] if typeof level_ is 'string'
		@threshold >= level_

	debug:     (msg, args...) -> @_router('debug',     msg, args...)
	info:      (msg, args...) -> @_router('info',      msg, args...)
	log:       (msg, args...) -> @_router('log',       msg, args...)
	warn:      (msg, args...) -> @_router('warn',      msg, args...)
	error:     (msg, args...) -> @_router('error',     msg, args...)
	critical:  (msg, args...) -> @_router('critical',  msg, args...)
	panic:     (msg, args...) -> @_router('panic',     msg, args...)
	emergency: (msg, args...) -> @_router('emergency', msg, args...)

	dir: (obj, options) ->
		options ?= {}
		options.depth ?= 0
		options.color ?= in_color
		super obj,
			depth: options.depth
			colors: options.color
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
		return

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
		return

module.exports = VerbosityMatrix
