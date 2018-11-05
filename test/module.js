'use strict'

import stream from 'stream'
import test from 'ava'
import {createConsole, getVersion} from '..'
import pkg from '../package'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

test(`Module version is '${pkg.version}'.`, t => {
	t.is(`${pkg.version}`, getVersion())
})

test(`Module long version is '${pkg.name} v${pkg.version}'.`, t => {
	t.is(`${pkg.name} v${pkg.version}`, getVersion(2))
})

const testConsole = createConsole({outStream: StreamProxy})

test('Default level is 3 (log)', t => {
	t.is(testConsole.verbosity(), 3)
})

test('Set log level to 1 (error)', t => {
	testConsole.verbosity(1)
	t.is(testConsole.verbosity(), 1)
})

