/* eslint quotes:0 */
import stream from 'stream'
import test from 'ava'
import {createConsole} from '..'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

const testConsole = createConsole({outStream: StreamProxy})

test('Pretty print', t => {
	testConsole.pretty({
		test: 'Testing',
		another: {
			level: 'deep'
		}
	}, 2, false)
	const result = StreamProxy.read()
	t.is(result, "Content: Object\n  test ▸ 'Testing', another ▸ { level ▸ 'deep' } \n")
})

test('Object dir print', t => {
	testConsole.dir({
		test: 'Testing',
		another: {
			level: 'deep'
		}
	}, {
		depth: 2,
		colors: false
	})
	const result = StreamProxy.read()
	t.is(result, "{ test: 'Testing', another: { level: 'deep' } }")
})

test('Object yargs print', t => {
	testConsole.yargs({
		_: ['one', 'two', 'three'],
		$0: 'self',
		test: 'Testing'
	}, false)
	const result = StreamProxy.read()
	t.is(result, "Options (yargs):\n  arguments ▸ 'one two three', self ▸ 'self', test ▸ 'Testing' \n")
})
