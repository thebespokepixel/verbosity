import stream from 'stream'
import test from 'ava'
import {createConsole} from '..'

const StreamProxy1 = new stream.PassThrough()
StreamProxy1.setEncoding('utf8')

const StreamProxy2 = new stream.PassThrough()
StreamProxy2.setEncoding('utf8')

test('Set verbosity 1 on one instance and globally affects another', t => {
	const testConsole1 = createConsole({outStream: StreamProxy1, global: true})
	const testConsole2 = createConsole({outStream: StreamProxy2, global: true})
	testConsole1.verbosity(1)
	t.is(testConsole2.verbosity(), 1)
})

test('Set verbosity 2 on one instance and globally affects another', t => {
	const testConsole1 = createConsole({outStream: StreamProxy1, global: true})
	const testConsole2 = createConsole({outStream: StreamProxy2, global: true})
	testConsole1.verbosity(2)
	t.is(testConsole2.verbosity(), 2)
})

test('Set verbosity 3 on one instance and globally affects another', t => {
	const testConsole1 = createConsole({outStream: StreamProxy1, global: true})
	const testConsole2 = createConsole({outStream: StreamProxy2, global: true})
	testConsole1.verbosity(3)
	t.is(testConsole2.verbosity(), 3)
})

test('Set verbosity 3 on one instance mutes debug output on another', t => {
	const testConsole1 = createConsole({outStream: StreamProxy1, global: true})
	const testConsole2 = createConsole({outStream: StreamProxy2, global: true})
	testConsole1.verbosity(3)
	testConsole2.debug('testing')
	const result = StreamProxy2.read()
	t.is(result, null)
})

test('Set verbosity 5 on one instance allows info output on another', t => {
	const testConsole1 = createConsole({outStream: StreamProxy1, global: true})
	const testConsole2 = createConsole({outStream: StreamProxy2, global: true})
	testConsole1.verbosity(5)
	testConsole2.info('testing')
	const result = StreamProxy2.read()
	t.is(result, 'testing\n')
})
