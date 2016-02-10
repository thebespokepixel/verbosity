'use strict'
/*
	verbosity
	Message Logging Priority Matrix
*/

var _util = require('util')

var _util2 = _interopRequireDefault(_util)

var _termNg = require('term-ng')

var _termNg2 = _interopRequireDefault(_termNg)

var _sparkles = require('sparkles')

var _sparkles2 = _interopRequireDefault(_sparkles)

var _dateformat = require('dateformat')

var _dateformat2 = _interopRequireDefault(_dateformat)

var _chalk = require('chalk')

var _chalk2 = _interopRequireDefault(_chalk)

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : {
		default: obj
	}
}

const format = _util2.default.format
const inspect = _util2.default.inspect
const inColor = !_termNg2.default.color.level === false

class VerbosityMatrix extends console.Console {
	constructor(options_) {
		let outStream = options_.outStream
		let errorStream = options_.errorStream
		const verbosity = options_.verbosity
		const timestamp = options_.timestamp
		const namespace = options_.namespace
		const prefix = options_.prefix

		outStream = outStream ? outStream : process.stdout
		errorStream = errorStream ? errorStream : outStream

		if (!outStream.writable) {
			throw new Error('Provided output stream must be writable')
		}

		if (!errorStream.writable) {
			throw new Error('Provided error stream must be writable')
		}

		super(outStream, errorStream)

		this.emits = namespace ? namespace : false
		if (this.emits) {
			this.emitter = (0, _sparkles2.default)(namespace)
		}

		const tstamp = timestamp ? () => `[${ _chalk2.default.dim((0, _dateformat2.default)(timestamp)) }] ` : () => ''
		const pfix = prefix ? () => `[${ prefix }] ` : () => ''

		this.threshold = verbosity ? verbosity : 3
		this.outStream = outStream
		this.errorStream = errorStream

		this._levels = {
			debug: {
				level:  5,
				stream: outStream,
				format: msg => `${ tstamp() }${ pfix() }${ _chalk2.default.dim(msg) }`
			},
			info: {
				level:  4,
				stream: outStream,
				format: msg => `${ tstamp() }${ pfix() }${ msg }`
			},
			log: {
				level:  3,
				stream: outStream,
				format: msg => `${ tstamp() }${ pfix() }${ msg }`
			},
			warn: {
				level:  2,
				stream: errorStream,
				format: msg => `${ tstamp() }${ pfix() }${ _chalk2.default.yellow(msg) }`
			},
			error: {
				level:  1,
				stream: errorStream,
				format: msg => `${ tstamp() }${ pfix() }${ _chalk2.default.red(`ERROR: ${ msg }`) }`
			},
			critical: {
				level:  0,
				stream: errorStream,
				format: msg => `${ tstamp() }${ pfix() }${ _chalk2.default.bold.red(`CRITICAL: ${ msg }`) }`
			},
			panic: {
				level:  0,
				stream: errorStream,
				format: msg => `${ tstamp() }${ pfix() }${ _chalk2.default.bold.red(`PANIC: ${ msg }`) }`
			},
			emergency: {
				level:  0,
				stream: errorStream,
				format: msg => `${ tstamp() }${ pfix() }${ _chalk2.default.bold.red(`EMERGENCY: ${ msg }`) }`
			}
		}
	}

	_router(level_, msg) {
		for (var _len = arguments.length, a = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			a[_key - 2] = arguments[_key]
		}

		msg = a.length > 0 ? format.apply(undefined, [msg].concat(a)) : msg
		if (this.emits) {
			this.emitter.emit(level_, msg)
		}
		if (this.threshold >= this._levels[level_].level) {
			this._levels[level_].stream.write(`${ this._levels[level_].format(msg) }
`)
		}
	}

	verbosity(level_) {
		level_ = typeof level_ === 'string' ? this.levels[level_] : level_
		if (level_ < 6) {
			this.threshold = level_
		}
		return this.threshold
	}

	canWrite(level_) {
		level_ = typeof level_ === 'string' ? this.levels[level_] : level_
		return this.threshold >= level_
	}

	debug(msg) {
		for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			args[_key2 - 1] = arguments[_key2]
		}

		this._router.apply(this, ['debug', msg].concat(args))
	}
	info(msg) {
		for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
			args[_key3 - 1] = arguments[_key3]
		}

		this._router.apply(this, ['info', msg].concat(args))
	}
	log(msg) {
		for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
			args[_key4 - 1] = arguments[_key4]
		}

		this._router.apply(this, ['log', msg].concat(args))
	}
	warn(msg) {
		for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
			args[_key5 - 1] = arguments[_key5]
		}

		this._router.apply(this, ['warn', msg].concat(args))
	}
	error(msg) {
		for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
			args[_key6 - 1] = arguments[_key6]
		}

		this._router.apply(this, ['error', msg].concat(args))
	}
	critical(msg) {
		for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
			args[_key7 - 1] = arguments[_key7]
		}

		this._router.apply(this, ['critical', msg].concat(args))
	}
	panic(msg) {
		for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
			args[_key8 - 1] = arguments[_key8]
		}

		this._router.apply(this, ['panic', msg].concat(args))
	}
	emergency(msg) {
		for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
			args[_key9 - 1] = arguments[_key9]
		}

		this._router.apply(this, ['emergency', msg].concat(args))
	}

	dir(obj) {
		let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1]

		options.depth = options.depth === undefined ? 0 : options.depth
		options.color = options.color === undefined ? inColor : options.color
		super.dir(obj, {
			depth:  options.depth,
			colors: options.color
		})
	}

	pretty(obj) {
		let descend = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1]

		const formatted = inspect(obj, {
			depth:  descend,
			colors: inColor
		})
		this.outStream.write(format('Content: %s\n', formatted.slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/:/g, ' ▸').replace(/,\n/g, '\n')))
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
		const formatted = inspect(parsed, {
			colors: inColor
		})
		this.outStream.write(format('Options (yargs):\n  %s\n', formatted.slice(2, -1).replace(/:/g, ' ▸').replace(/,\n/g), '\n'))
	}
}

module.exports = VerbosityMatrix

