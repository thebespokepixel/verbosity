'use strict'
###
	verbosity (v0.0.7)
	Message Logging Priority Matrix
###
util = require 'util'

class VerbosityMatrix extends console.Console
	constructor: (@outStream, @errorStream, @level) ->
		@errorStream ?= @outStream

		unless @outStream.writable and @errorStream.writable
			throw new Error "Provided outputs must be writable streams"

		super @outStream, @errorStream

	verbosity: (newLevel) =>
		@level = newLevel if 0 < newLevel < 6
		@level

	debug: (chunks...) =>
		if @level > 4 then @outStream.write util.format chunks...
		else off

	log: (chunks...) =>
		if @level > 3 then @outStream.write util.format chunks...
		else off

	info:  (chunks...) =>
		if @level > 2 then @outStream.write util.format chunks...
		else off

	warn: (chunks...) =>
		if @level > 1 then @errorStream.write util.format chunks...
		else off

	error:  (chunks...) =>
		if @level > 0 then @errorStream.write util.format chunks...
		else off

	dir: (obj) ->
		super obj,
			showHidden: no
			depth: 5
			colors: yes
		obj

module.exports = VerbosityMatrix
