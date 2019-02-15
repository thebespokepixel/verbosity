'use strict'
import stream from 'stream'
import test from 'ava'
import {createConsole} from '..'
import chalk from 'chalk'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

const logmessage = (message, outcome) => {
	return {
		raw: message,
		src: message,
		dest: `${message}\n`,
		formatted: `${message}`,
		willRead: outcome}
}

const logcoloured = (message, sgr, prefix, outcome) => {
	const raw = chalk[sgr](`${prefix}${message}`)
	return {
		raw,
		src: message,
		dest: `${raw}\n`,
		willRead: outcome}
}

const logbold = (message, sgr, prefix, outcome) => {
	const raw = chalk.bold[sgr](`${prefix}${message}`)
	return {
		raw,
		src: message,
		dest: `${raw}\n`,
		willRead: outcome}
}

const levels = [{
	debug: logcoloured('hmmmm', 'dim', '', true),
	info: logmessage('interesting', true),
	log: logmessage('oh, ok', true),
	warn: logcoloured('what happened?', 'yellow', '', true),
	error: logcoloured('arrrgh!', 'red', 'ERROR: ', true),
	critical: logbold('Red Alert!', 'red', 'CRITICAL: ', true)
}, {
	debug: logcoloured('hmmmm', 'dim', '', false),
	info: logmessage('interesting', true),
	log: logmessage('oh, ok', true),
	warn: logcoloured('what happened?', 'yellow', '', true),
	error: logcoloured('arrrgh!', 'red', 'ERROR: ', true),
	panic: logbold('PANIC!', 'red', 'PANIC: ', true)
}, {
	debug: logcoloured('hmmmm', 'dim', '', false),
	info: logmessage('interesting', false),
	log: logmessage('oh, ok', true),
	warn: logcoloured('what happened?', 'yellow', '', true),
	error: logcoloured('arrrgh!', 'red', 'ERROR: ', true),
	emergency: logbold('EMERGENCY!', 'red', 'EMERGENCY: ', true)
}, {
	debug: logcoloured('hmmmm', 'dim', '', false),
	info: logmessage('interesting', false),
	log: logmessage('oh, ok', false),
	warn: logcoloured('what happened?', 'yellow', '', true),
	error: logcoloured('arrrgh!', 'red', 'ERROR: ', true),
	critical: logbold('Blimey Penfold!', 'red', 'CRITICAL: ', true)
}, {
	debug: logcoloured('hmmmm', 'dim', '', false),
	info: logmessage('interesting', false),
	log: logmessage('oh, ok', false),
	warn: logcoloured('what happened?', 'yellow', '', false),
	error: logcoloured('arrrgh!', 'red', 'ERROR: ', true),
	critical: logbold('Damn you Chell, not again.', 'red', 'CRITICAL: ', true)
}]

function runSuite(title_, console_, stamp_ = '') {
	let targetLevel = 5
	levels.forEach(suite => {
		console_.verbosity(targetLevel)
		Object.keys(suite).forEach(level => {
			console_[level](suite[level].src)
			const result = StreamProxy.read()
			test(`${title_} @ ${targetLevel}, Level: ${level}: ${['-', stamp_ + suite[level].raw][0 | suite[level].willRead]}`, t => {
				if (suite[level].willRead) {
					t.deepEqual(`${stamp_}${suite[level].dest}`, result)
				} else {
					t.is(result, null)
				}
			})
		})
		targetLevel--
	})
}

runSuite(
	'Normal',
	createConsole({outStream: StreamProxy})
)


runSuite(
	'Timestamp',
	createConsole({outStream: StreamProxy, timestamp: 'XX:XX:XX'}),
	`[${chalk.dim('XX:XX:XX')}] `
)

