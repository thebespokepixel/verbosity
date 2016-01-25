'use strict'
###
	verbosity (v0.1.3-alpha.0)
	Loggin Level Tests
###

_package = require '../package.json'

vows = require 'vows'
assert = require 'assert'
chalk = require 'chalk'

StreamProxy = new (require('stream').PassThrough)
StreamProxy.setEncoding 'utf8'

verbosity = require '..'
console = verbosity.console
	outStream: StreamProxy

logmessage = (message, outcome) ->
	context =
		topic: ->
			levels = @context.title.split /\s+/
			level = parseInt levels[1]
			console.verbosity level
			console[@context.name] message
			@callback null, outcome, StreamProxy.read(), message

		"Message '#{message}' logged? #{['no','yes'][0 | outcome]}": (error_, outcome_, message_, messageIn_) ->

			assert.isNull error_
			assert.isTrue (message_ is "#{messageIn_}\n") is outcome_

logcoloured = (message, sgr, prefix, outcome) ->
	context =
		topic: ->
			levels = @context.title.split /\s+/
			level = parseInt levels[1]
			console.verbosity level
			console[@context.name] message
			@callback null, outcome, StreamProxy.read(), message

		"Coloured message '#{message}' logged? #{['no','yes'][0 | outcome]}": (error_, outcome_, message_, messageIn_) ->

			assert.isNull error_
			assert.isTrue (message_ is "#{chalk[sgr](prefix + messageIn_)}\n") is outcome_

logbold = (message, sgr, prefix, outcome) ->
	context =
		topic: ->
			levels = @context.title.split /\s+/
			level = parseInt levels[1]
			console.verbosity level
			console[@context.name] message
			@callback null, outcome, StreamProxy.read(), message

		"Bold, coloured message '#{message}' logged? #{['no','yes'][0 | outcome]}": (error_, outcome_, message_, messageIn_) ->

			assert.isNull error_
			assert.isTrue (message_ is "#{chalk.bold[sgr](prefix + messageIn_)}\n") is outcome_
vows
	.describe("#{_package.name} log levels")
	.addBatch
		'level 5':
			debug    : logcoloured 'hmmmm', 'dim', '', yes
			info     : logmessage 'interesting', yes
			log      : logmessage 'oh, ok', yes
			warn     : logcoloured 'what happened?', 'yellow', '', yes
			error    : logcoloured 'arrrgh!', 'red', 'ERROR: ', yes
			critical : logbold 'Red Alert!', 'red', 'CRITICAL: ', yes
		'level 4':
			debug    : logcoloured 'hmmmm', 'dim', '', no
			info     : logmessage 'interesting', yes
			log      : logmessage 'oh, ok', yes
			warn     : logcoloured 'what happened?', 'yellow', '', yes
			error    : logcoloured 'arrrgh!', 'red', 'ERROR: ', yes
			panic    : logbold 'PANIC!', 'red', 'PANIC: ', yes
		'level 3':
			debug     : logcoloured 'hmmmm', 'dim', '', no
			info      : logmessage 'interesting', no
			log       : logmessage 'oh, ok', yes
			warn      : logcoloured 'what happened?', 'yellow', '', yes
			error     : logcoloured 'arrrgh!', 'red', 'ERROR: ', yes
			emergency : logbold 'EMERGENCY!', 'red', 'EMERGENCY: ', yes
		'level 2':
			debug    : logcoloured 'hmmmm', 'dim', '', no
			info     : logmessage 'interesting', no
			log      : logmessage 'oh, ok', no
			warn     : logcoloured 'what happened?', 'yellow', '', yes
			error    : logcoloured 'arrrgh!', 'red', 'ERROR: ', yes
			critical : logbold 'Blimey Penfold!', 'red', 'CRITICAL: ', yes
		'level 1':
			debug    : logcoloured 'hmmmm', 'dim', '', no
			info     : logmessage 'interesting', no
			log      : logmessage 'oh, ok', no
			warn     : logcoloured 'what happened?', 'yellow', '', no
			error    : logcoloured 'arrrgh!', 'red', 'ERROR: ', yes
			critical : logbold 'Damn you Chell, not again.', 'red', 'CRITICAL: ', yes
	.export(module)

