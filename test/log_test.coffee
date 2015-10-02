'use strict'
###
	verbosity (v0.0.12)
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
			assert (message_ is messageIn_ + "\n") is outcome_

logcoloured = (message, sgr, prefix, outcome) ->
	context =
		topic: ->
			levels = @context.title.split /\s+/
			level = parseInt levels[1]
			cli.verbosity level
			cli[@context.name] message
			@callback null, outcome, StreamProxy.read(), message

		"Message '#{message}' logged? #{['no','yes'][0 | outcome]}": (error_, outcome_, message_, messageIn_) ->

			assert.isNull error_
			assert (message_ is "\x1b[#{sgr}m"+ "#{prefix}" + messageIn_ + "\x1b[0m\n") is outcome_
vows
	.describe("#{_package.name} log levels")
	.addBatch
		'level 5':
			debug    : logmessage 'hmmmm', yes
			info     : logmessage 'interesting', yes
			log      : logmessage 'oh, ok', yes
			warn     : logcoloured 'what happened?', 33, '', yes
			error    : logcoloured 'arrrgh!', 31, 'ERROR: ', yes
			critical : logcoloured 'PANIC!', 31, 'CRITICAL: ', yes
		'level 4':
			debug    : logmessage 'hmmmm', no
			info     : logmessage 'interesting', yes
			log      : logmessage 'oh, ok', yes
			warn     : logcoloured 'what happened?', 33, '', yes
			error    : logcoloured 'arrrgh!', 31, 'ERROR: ', yes
			critical : logcoloured 'PANIC!', 31, 'CRITICAL: ', yes
		'level 3':
			debug    : logmessage 'hmmmm', no
			info     : logmessage 'interesting', no
			log      : logmessage 'oh, ok', yes
			warn     : logcoloured 'what happened?', 33, '', yes
			error    : logcoloured 'arrrgh!', 31, 'ERROR: ', yes
			critical : logcoloured 'PANIC!', 31, 'CRITICAL: ', yes
		'level 2':
			debug    : logmessage 'hmmmm', no
			info     : logmessage 'interesting', no
			log      : logmessage 'oh, ok', no
			warn     : logcoloured 'what happened?', 33, '', yes
			error    : logcoloured 'arrrgh!', 31, 'ERROR: ', yes
			critical : logcoloured 'PANIC!', 31, 'CRITICAL: ', yes
		'level 1':
			debug    : logmessage 'hmmmm', no
			info     : logmessage 'interesting', no
			log      : logmessage 'oh, ok', no
			warn     : logcoloured 'what happened?', 33, '', no
			error    : logcoloured 'arrrgh!', 31, 'ERROR: ', yes
			critical : logcoloured 'PANIC!', 31, 'CRITICAL: ', yes
	.export(module)

