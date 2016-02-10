'use strict'

import stream from 'stream'
import test from 'ava'
import verbosity from '..'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

const testConsole = verbosity.console({outStream: StreamProxy})

test(`Pretty Objects`, t => {
	testConsole.pretty({
		test1: 'a',
		test2: 'b',
		test3: [1, 2, 3]
	}, {
		depth: 2
	})
	t.is(StreamProxy.read(), `Content: Object\n  test1 ▸ \u001b[32m'a'\u001b[39m, test2 ▸ \u001b[32m'b'\u001b[39m, test3 ▸ [ \u001b[33m1\u001b[39m, \u001b[33m2\u001b[39m, \u001b[33m3\u001b[39m ] \n`)
})
