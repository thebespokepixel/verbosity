import stream from 'node:stream'
import test from 'ava'
import {createConsole} from '../index.js'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

const testConsole = createConsole({outStream: StreamProxy})

test('Multiple arguments', t => {
	testConsole.log('this', 'has', 'many', 'arguments')
	const result = StreamProxy.read()
	t.is(result, 'this has many arguments\n')
})

test('Printf-like arguments', t => {
	testConsole.log('this %s %s', 'has', 'printf', 'like', 'arguments')
	const result = StreamProxy.read()
	t.is(result, 'this has printf like arguments\n')
})
