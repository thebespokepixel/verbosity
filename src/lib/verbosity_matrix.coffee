'use strict'
###
	verbosity (v0.0.6)
	Message Logging Priority Matrix
###

Console = require("console").Console
Console::debug = (chunks...) ->
	this.log chunks...

class VerbosityMatrix extends Console
	constructor: (@outStream = process.stderr, @errorStream = null, @level = 4) ->
		super @outStream, @errorStream

	verbosity: (newLevel) ->
		@level = newLevel if 0 < newLevel < 6

	debug: (chunks...) =>
		if @level > 4
			super chunks...
			chunks.join ' '
		else return ''

	log: (chunks...) =>
		if @level > 3
			super chunks...
			chunks.join ' '
		else return ''

	info:  (chunks...) =>
		if @level > 2
			super chunks...
			chunks.join ' '
		else return ''

	warn: (chunks...) =>
		if @level > 1
			super chunks...
			chunks.join ' '
		else return ''

	error:  (chunks...) =>
		if @level > 0
			super chunks...
			chunks.join ' '
		else return

	dir: (obj) ->
		super obj,
			showHidden: no
			depth: 5
			colors: yes
		obj

module.exports = VerbosityMatrix
