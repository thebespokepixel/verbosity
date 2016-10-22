'use strict'

import stream from 'stream'
import test from 'ava'
import {createConsole, getVersion} from '..'
import pkg from '../package'

const expectedVersion = ((pkg.buildNumber === 0) && pkg.version) || `${pkg.version}-Δ${pkg.buildNumber}`

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

test(`Module version is '${pkg.version}'.`, t => {
	t.is(`${expectedVersion}`, getVersion())
})

test(`Module long version is '${pkg.name} v${pkg.version}'.`, t => {
	t.is(`${pkg.name} v${expectedVersion}`, getVersion(2))
})

const testConsole = createConsole({outStream: StreamProxy})

test('Verbosity Console‘s prototype inherits from console', t => {
	t.true(testConsole.prototype === Object.getPrototypeOf(console))
})

test('Default level is 3 (log)', t => {
	t.is(testConsole.verbosity(), 3)
})

test('Set log level to 1 (error)', t => {
	testConsole.verbosity(1)
	t.is(testConsole.verbosity(), 1)
})

