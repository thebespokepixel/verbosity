import stream from 'stream'
import test from 'ava'
import pkg from '../package.json'
import {createConsole, getVersion, Verbosity} from '..'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

test(`Module version is '${pkg.version}'`, t => {
	t.is(`${pkg.version}`, getVersion())
})

test(`Module long version is '${pkg.name} v${pkg.version}'`, t => {
	t.is(`${pkg.name} v${pkg.version}`, getVersion(2))
})

test('console is instance of Verbosity', t => {
	const testConsole = createConsole({outStream: StreamProxy})
	t.true(testConsole instanceof Verbosity)
})

test('console is instance of console.Console', t => {
	const testConsole = createConsole({outStream: StreamProxy})
	t.true(testConsole instanceof console.Console)
})

test('Default level is 3 (log)', t => {
	const testConsole = createConsole({outStream: StreamProxy})
	t.is(testConsole.verbosity(), 3)
})

test('Set log level to 1 (error)', t => {
	const testConsole = createConsole({outStream: StreamProxy})
	testConsole.verbosity(1)
	t.is(testConsole.verbosity(), 1)
})

