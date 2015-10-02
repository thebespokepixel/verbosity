'use strict'
###
	verbosity (v0.0.9)
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
		if @threshold > 4 then @outStream.write util.format chunks...
		else off

	log: (chunks...) =>
		if @threshold > 3 then @outStream.write util.format chunks...
		else off

	info: (chunks...) =>
		if @threshold > 2 then @outStream.write util.format chunks...
		else off

	warn: (chunks...) =>
		if @threshold > 1 then @errorStream.write util.format chunks...
		else off

	error: (chunks...) =>
		if @threshold > 0 then @errorStream.write util.format chunks...
		else off

	dir: (obj) ->
		super obj,
			showHidden: no
			depth: 5
			colors: yes
		obj

module.exports = VerbosityMatrix
