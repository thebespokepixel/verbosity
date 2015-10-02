'use strict'
###
	verbosity (v0.0.11)
	Module Tests
###

_package = require '../package.json'

vows = require 'vows'
assert = require 'assert'

StreamProxy = new (require('stream').PassThrough)
StreamProxy.setEncoding 'utf8'

verbosity = require '..'

vows
	.describe("#{_package.name} module")
	.addBatch
		'Module':
			"name is #{_package.name}?":
				topic: verbosity.getName()
				"#{_package.name}": (topic) ->
					assert topic is _package.name

	.addBatch
		'Module version':
			"is semvar?":
				topic: verbosity.getVersion 1
				"#{_package.version} matches /[0-9]+.[0-9]+.[0-9]+[0-9a-z.-]*/": (topic) ->
					assert.match topic, /[0-9]+.[0-9]+.[0-9]+[0-9a-z.-]*/

			"is #{_package.version}?":
				topic: verbosity.getVersion 1
				"Should === #{_package.version}": (topic) ->
					assert topic is _package.version

			"(long) is #{_package.name} v#{_package.version}":
				topic: verbosity.getVersion 2
				"Should === #{_package.name} v#{_package.version}": (topic) ->
					assert topic is "#{_package.name} v#{_package.version}"

.export(module)

vows
	.describe('verbosity console')
	.addBatch
		'Console':
			'instantiation?':
				topic: ->
					cli = verbosity.console StreamProxy
				'cli should be an instanceof console.Console': (topic) ->
					assert.instanceOf topic, console.Console

			'level is 5 (debug)?':
				topic: ->
					cli = verbosity.console StreamProxy
					cli.verbosity()
				"Should be 5": (topic) ->
					assert.equal topic, 5

			'set level to 1 (error)?':
				topic: ->
					cli = verbosity.console StreamProxy
					cli.verbosity 1
				"Should be 1": (topic) ->
					assert.equal topic, 1
.export(module)

