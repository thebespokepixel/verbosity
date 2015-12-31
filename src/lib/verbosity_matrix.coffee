'use strict'
###
	verbosity (v0.1.2)
	Message Logging Priority Matrix
###
util = require 'util'
in_color = not (/no-color/.test process.argv.join '')

class VerbosityMatrix extends console.Console
	constructor: (options_) ->
		{ out, error, verbosity } = options_

		out ?= process.stdout
		error ?= out

		unless out.writable
			throw new Error 'Provided output stream must be writable'
		unless error.writable
			throw new Error 'Provided error stream must be writable'

		super out, error

		@threshold = verbosity ? 3
		@outStream = out
		@errorStream = error

	verbosity: (level_) =>
		@threshold = level_ if 0 < level_ < 6
		@threshold

	canWrite: (level_) =>
		@threshold >= level_

	debug: (chunks...) =>
		if @threshold > 4 then @outStream.write util.format(chunks...) + "\n"
		off

	info: (chunks...) =>
		if @threshold > 3 then @outStream.write util.format(chunks...) + "\n"
		off

	log: (chunks...) =>
		if @threshold > 2 then @outStream.write util.format(chunks...) + "\n"
		off

	warn: (chunks...) =>
		if @threshold > 1 then @errorStream.write "\x1b[33m" + util.format(chunks...) + "\x1b[0m\n"
		off

	error: (chunks...) =>
		if @threshold > 0 then @errorStream.write "\x1b[31mERROR: " + util.format(chunks...) + "\x1b[0m\n"
		off

	critical: (chunks...) =>
		if @threshold > 0 then @errorStream.write "\x1b[1m\x1b[31mCRITICAL: " + util.format(chunks...) + "\x1b[0m\n"
		off

	panic: (chunks...) -> @critical chunks...
	emergency: (chunks...) -> @critical chunks...

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
		formatted = util.inspect obj,
			depth: descend
			colors: in_color
		@outStream.write util.format "Content: %s\n", formatted[..-2].
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

		formatted = util.inspect parsed,
			colors: in_color

		@outStream.write util.format "Options (yargs):\n  %s\n", formatted[2..-2].replace(/:/g, ' ▸').replace /,\n/g, '\n'

module.exports = VerbosityMatrix
