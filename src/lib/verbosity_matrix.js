'use strict'
/*
	verbosity
	Message Logging Priority Matrix
*/

import util from 'util'
import termNG from 'term-ng'
import sparkles from 'sparkles'
import dateformat from 'dateformat'
import chalk from 'chalk'

const format = util.format
const inspect = util.inspect
const inColor = (!termNG.color.level === false)

class VerbosityMatrix extends console.Console {
	constructor(options_) {
		let {outStream, errorStream} = options_
		const {verbosity, timestamp, namespace, prefix} = options_
		outStream = (outStream) ? outStream : process.stdout
		errorStream = (errorStream) ? errorStream : outStream

		if (!outStream.writable) {
			throw new Error('Provided output stream must be writable')
		}

		if (!errorStream.writable) {
			throw new Error('Provided error stream must be writable')
		}

		super(outStream, errorStream)

		this.emits = namespace ? namespace : false
		if (this.emits) {
			this.emitter = sparkles(namespace)
		}

		const tstamp = timestamp ? () => `[${chalk.dim(dateformat(timestamp))}] ` : () => ''
		const pfix = prefix ? () => `[${prefix}] ` : () => ''

		this.threshold = (verbosity) ? verbosity : 3
		this.outStream = outStream
		this.errorStream = errorStream

		this._levels = {
			debug: {
				level: 5,
				stream: outStream,
				format: msg => `${tstamp()}${pfix()}${chalk.dim(msg)}`
			},
			info: {
				level: 4,
				stream: outStream,
				format: msg => `${tstamp()}${pfix()}${msg}`
			},
			log: {
				level: 3,
				stream: outStream,
				format: msg => `${tstamp()}${pfix()}${msg}`
			},
			warn: {
				level: 2,
				stream: errorStream,
				format: msg => `${tstamp()}${pfix()}${chalk.yellow(msg)}`
			},
			error: {
				level: 1,
				stream: errorStream,
				format: msg => `${tstamp()}${pfix()}${chalk.red(`ERROR: ${msg}`)}`
			},
			critical: {
				level: 0,
				stream: errorStream,
				format: msg => `${tstamp()}${pfix()}${chalk.bold.red(`CRITICAL: ${msg}`)}`
			},
			panic: {
				level: 0,
				stream: errorStream,
				format: msg => `${tstamp()}${pfix()}${chalk.bold.red(`PANIC: ${msg}`)}`
			},
			emergency: {
				level: 0,
				stream: errorStream,
				format: msg => `${tstamp()}${pfix()}${chalk.bold.red(`EMERGENCY: ${msg}`)}`
			}
		}
	}

	_router(level_, msg, ...a) {
		msg = (a.length > 0) ? format(msg, ...a) : msg
		if (this.emits) {
			this.emitter.emit(level_, msg)
		}
		if (this.threshold >= this._levels[level_].level) {
			this._levels[level_].stream.write(`${this._levels[level_].format(msg)}\n`)
		}
	}

	verbosity(level_) {
		level_ = (typeof level_ === 'string') ? this.levels[level_] : level_
		if (level_ < 6) {
			this.threshold = level_
		}
		return this.threshold
	}

	canWrite(level_) {
		level_ = (typeof level_ === 'string') ? this.levels[level_] : level_
		return this.threshold >= level_
	}

	debug(msg, ...args) {
		this._router('debug', msg, ...args)
	}
	info(msg, ...args) {
		this._router('info', msg, ...args)
	}
	log(msg, ...args) {
		this._router('log', msg, ...args)
	}
	warn(msg, ...args) {
		this._router('warn', msg, ...args)
	}
	error(msg, ...args) {
		this._router('error', msg, ...args)
	}
	critical(msg, ...args) {
		this._router('critical', msg, ...args)
	}
	panic(msg, ...args) {
		this._router('panic', msg, ...args)
	}
	emergency(msg, ...args) {
		this._router('emergency', msg, ...args)
	}

	dir(obj, options = {}) {
		options.depth = (options.depth === undefined) ? 0 : options.depth
		options.color = (options.color === undefined) ? inColor : options.color
		super.dir(obj, {
			depth: options.depth,
			colors: options.color
		})
	}

	pretty(obj, descend = 0) {
		const formatted = inspect(obj, {
			depth: descend,
			colors: inColor
		})
		this.outStream.write(format('Content: %s\n', formatted.slice(0, -1)
			.replace(/^{/, 'Object\n ')
			.replace(/^\[/, 'Array\n ')
			.replace(/^(\w+) {/, '$1')
			.replace(/:/g, ' ▸')
			.replace(/,\n/g, '\n')
		))
	}

	yargs(obj) {
		const parsed = {}
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const val = obj[key]
				switch (key) {
					case '_':
						if (val.length > 0) {
							parsed.arguments = val.join(' ')
						}
						break
					case '$0':
						parsed.self = val
						break
					default:
						if (key.length > 1) {
							parsed[key] = val
						}
				}
			}
		}
		const formatted = inspect(parsed, {colors: inColor})
		this.outStream.write(format('Options (yargs):\n  %s\n', formatted.slice(2, -1).replace(/:/g, ' ▸').replace(/,\n/g)))
	}
}

module.exports = VerbosityMatrix
