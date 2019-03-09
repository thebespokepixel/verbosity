import stream from 'stream'
import test from 'ava'
import {createConsole} from '..'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

const testConsole = createConsole({outStream: StreamProxy})

test('Default count', t => {
	testConsole.count()
	testConsole.count()
	testConsole.count()
	const result = StreamProxy.read()
	t.is(result, `default: 1
default: 2
default: 3
`)
})
