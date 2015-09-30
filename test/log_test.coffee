'use strict'
###
	verbosity (v0.0.5-alpha.18)
	Loggin Level Tests
###

vows = require 'vows'
assert = require 'assert'
StreamProxy = new (require('stream').PassThrough)
StreamProxy.setEncoding 'utf8'
verbosity = require '..'
cli = new verbosity.console StreamProxy

logmessage = (message, outcome) ->
	context =
		topic: ->
			levels = @context.name.split /\s+/
			level = levels[0]
			cmd = levels[1]
			cli.verbosity level
			cli[cmd] message
		"match #{message} or hidden": (topic) ->
			if outcome is yes then assert.match topic, /^[a-zA-Z0-9\?!+=\s]+/
			else assert.ok true, "No output at this level"
vows
	.describe 'verbosity log levels'
	.addBatch
		"Log level debug (5)":
			'as debug':
				topic: ->
					cli.verbosity 5
					cli.debug 'testing debug'
				'"testing debug" logged': (topic) ->
						assert.match topic, /testing debug/
			'as log':
				topic: ->
					cli.verbosity 5
					cli.log 'testing log'
				'"testing log" logged': (topic) ->
						assert.match topic, /testing log/
			'as info':
				topic: ->
					cli.verbosity 5
					cli.info 'testing info'
				'"testing info" logged': (topic) ->
						assert.match topic, /testing info/
	.addBatch
		'5 debug': logmessage 'hmmmm', yes
		'5 log':   logmessage 'oh, ok', yes
		'5 info':  logmessage 'interesting', yes
		'5 warn':  logmessage 'what happened?', yes
		'5 error': logmessage 'arrrgh!', yes
		'4 debug': logmessage 'hmmmm', no
		'4 log':   logmessage 'oh, ok', yes
		'4 info':  logmessage 'interesting', yes
		'4 warn':  logmessage 'what happened?', yes
		'4 error': logmessage 'arrrgh!', yes
		'3 debug': logmessage 'hmmmm', no
		'3 log':   logmessage 'oh, ok', no
		'3 info':  logmessage 'interesting', yes
		'3 warn':  logmessage 'what happened?', yes
		'3 error': logmessage 'arrrgh!', yes
		'2 debug': logmessage 'hmmmm', no
		'2 log':   logmessage 'oh, ok', no
		'2 info':  logmessage 'interesting', no
		'2 warn':  logmessage 'what happened?', yes
		'2 error': logmessage 'arrrgh!', yes
		'1 debug': logmessage 'hmmmm', no
		'1 log':   logmessage 'oh, ok', no
		'1 info':  logmessage 'interesting', no
		'1 warn':  logmessage 'what happened?', no
		'1 error': logmessage 'arrrgh!', yes
	.export(module)

