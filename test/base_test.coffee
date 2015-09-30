'use strict'
###
	verbosity (v0.0.5)
	Module Tests
###

vows = require 'vows'
assert = require 'assert'
_package = require '../package.json'
verbosity = require '..'

vows
	.describe('verbosity versioning')
	.addBatch
		'Get version as a':
			'short number?':
				topic: verbosity.getVersion 1
				'Should result in a short version number x.x.x-x': (topic) ->
					assert.match topic, /[0-9]+.[0-9]+.[0-9]+[0-9a-z.-]*/

			'long string?':
				topic: verbosity.getVersion 2
				"Should result in a long version number #{_package.name} vx.x.x-x": (topic) ->
					assert.match topic, new RegExp "#{_package.name} v[0-9]+.[0-9]+.[0-9]+[0-9a-z.-]*"
.export(module)

