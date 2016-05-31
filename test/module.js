'use strict'

import stream from 'stream'
import test from 'ava'
import {createConsole, getVersion} from '..'
import semverRegex from 'semver-regex'
import pkg from '../package.json'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

test(`Module version is '${pkg.version}'.`, t => {
	t.is(`${pkg.version}`, getVersion())
})

test(`Module long version is '${pkg.name} v${pkg.version}'.`, t => {
	t.is(`${pkg.name} v${pkg.version}`, getVersion(2))
})

test(`Module version '${pkg.version} is semver'.`, t => {
	t.truthy(semverRegex().test(getVersion()))
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

