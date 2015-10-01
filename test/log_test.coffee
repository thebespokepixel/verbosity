'use strict'
###
	verbosity (v0.0.7)
	Loggin Level Tests
###

_package = require '../package.json'

vows = require 'vows'
assert = require 'assert'

StreamProxy = new (require('stream').PassThrough)
StreamProxy.setEncoding 'utf8'

verbosity = require '..'
cli = verbosity.console StreamProxy

logmessage = (message, outcome) ->
	context =
		topic: ->
			levels = @context.title.split /\s+/
			level = parseInt levels[1]
			cli.verbosity level
			cli[@context.name] message
			@callback null, outcome, StreamProxy.read(), message

		"Message '#{message}' logged? #{['no','yes'][0 | outcome]}": (error_, outcome_, message_, messageIn_) ->

			assert.isNull error_
			assert (message_ is messageIn_) is outcome_
vows
	.describe("#{_package.name} log levels")
	.addBatch
		'level 5':
			debug: logmessage 'hmmmm', yes
			log:   logmessage 'oh, ok', yes
			info:  logmessage 'interesting', yes
			warn:  logmessage 'what happened?', yes
			error: logmessage 'arrrgh!', yes
		'level 4':
			debug: logmessage 'hmmmm', no
			log:   logmessage 'oh, ok', yes
			info:  logmessage 'interesting', yes
			warn:  logmessage 'what happened?', yes
			error: logmessage 'arrrgh!', yes
		'level 3':
			debug: logmessage 'hmmmm', no
			log:   logmessage 'oh, ok', no
			info:  logmessage 'interesting', yes
			warn:  logmessage 'what happened?', yes
			error: logmessage 'arrrgh!', yes
		'level 2':
			debug: logmessage 'hmmmm', no
			log:   logmessage 'oh, ok', no
			info:  logmessage 'interesting', no
			warn:  logmessage 'what happened?', yes
			error: logmessage 'arrrgh!', yes
		'level 1':
			debug: logmessage 'hmmmm', no
			log:   logmessage 'oh, ok', no
			info:  logmessage 'interesting', no
			warn:  logmessage 'what happened?', no
			error: logmessage 'arrrgh!', yes
	.export(module)

