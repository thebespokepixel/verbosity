'use strict'
###
	verbosity (v0.0.11)
	Message Logging Priority Matrix
###
util = require 'util'

class VerbosityMatrix extends console.Console
	constructor: (@outStream, @errorStream, @threshold) ->
		@errorStream ?= @outStream

		unless @outStream.writable and @errorStream.writable
			throw new Error "Provided outputs must be writable streams"

		super @outStream, @errorStream

	verbosity: (level_) =>
		@threshold = level_ if 0 < level_ < 6
		@threshold

	canWrite: (level_) =>
		@threshold >= level_

	debug: (chunks...) =>
		if @threshold > 4 then @outStream.write util.format(chunks...) + "\n"
		else off

	log: (chunks...) =>
		if @threshold > 3 then @outStream.write util.format(chunks...) + "\n"
		else off

	info: (chunks...) =>
		if @threshold > 2 then @outStream.write util.format(chunks...) + "\n"
		else off

	warn: (chunks...) =>
		if @threshold > 1 then @errorStream.write util.format(chunks...) + "\n"
		else off

	error: (chunks...) =>
		if @threshold > 0 then @errorStream.write util.format(chunks...) + "\n"
		else off

	dir: (obj) ->
		super obj,
			depth: 5
			colors: yes
		obj

	pretty: (obj, depth = 3) ->
		formatted = util.inspect obj,
			depth: depth
			colors: yes
		@outStream.write util.format "Object:\n  %s\n", formatted[2..-2].replace(/:/g, ' ▸').replace /,\n/g, '\n'

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
			colors: yes

		@outStream.write util.format "Options (yargs):\n  %s\n", formatted[2..-2]

module.exports = VerbosityMatrix
