'use strict'
###
	verbosity (v0.0.5)
	Loggin Level Stream Tests
###

vows = require 'vows'
assert = require 'assert'
StreamProxy = new (require('stream').PassThrough)
StreamProxy.setEncoding 'utf8'
verbosity = require '..'
cli = new verbosity.console StreamProxy

vows
	.describe('verbosity log levels (stream)')
	.addBatch
		'Log level debug (5)':
			'as debug':
				topic: ->
					cli.verbosity 5
					cli.debug 'testing debug'
					@callback null, StreamProxy.read()
				'"testing debug" logged': (error_, stream_) ->
						assert.isNull error_
						assert.match stream_, /testing debug/
			'as log':
				topic: ->
					cli.log 'testing log'
					@callback null, StreamProxy.read()
				'"testing log" logged': (error_, stream_) ->
						assert.isNull error_
						assert.match stream_, /testing log/
			'as info':
				topic: ->
					cli.info 'testing info'
					@callback null, StreamProxy.read()
				'"testing info" logged': (error_, stream_) ->
						assert.isNull error_
						assert.match stream_, /testing info/
	.addBatch
		'Log level info (3)':
			'as debug':
				topic: ->
					cli.verbosity 3
					cli.debug 'testing debug'
					@callback null, StreamProxy.read()
				'"testing debug" logged': (error_, stream_) ->
						assert.isNull error_
						assert.ok true, "No output at this level"
			'as log':
				topic: ->
					cli.log 'testing log'
					@callback null, StreamProxy.read()
				'"testing log" logged': (error_, stream_) ->
						assert.isNull error_
						assert.ok true, "No output at this level"
			'as info':
				topic: ->
					cli.info 'testing info'
					@callback null, StreamProxy.read()
				'"testing info" logged': (error_, stream_) ->
						assert.isNull error_
						assert.match stream_, /testing info/
.export(module)

