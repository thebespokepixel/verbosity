'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var util = _interopDefault(require('util'));
var consoleSource = _interopDefault(require('console'));
var termNG = _interopDefault(require('term-ng'));
var chalk = _interopDefault(require('chalk'));
var sparkles = _interopDefault(require('sparkles'));
var dateformat = _interopDefault(require('dateformat'));
var readPkg = _interopDefault(require('read-pkg-up'));

const format = util.format;
const inspect = util.inspect;

const _package = readPkg.sync({
	normalize: false
}).pkg;

const consoleFactory = function consoleFactory() {
	let options_ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	const outStream = options_.outStream;
	const errorStream = options_.errorStream;
	const verbosity = options_.verbosity;
	const timestamp = options_.timestamp;
	const namespace = options_.namespace;
	const prefix = options_.prefix;


	const sOut = (ws => {
		if (!ws.writable) {
			throw new Error('Provided output stream must be writable');
		}
		return ws;
	})(outStream ? outStream : process.stdout);

	const sErr = (ws => {
		if (!ws.writable) {
			throw new Error('Provided error stream must be writable');
		}
		return ws;
	})(errorStream ? errorStream : sOut);

	const willEmit = Boolean(namespace);

	const timeFormatter = (ts => ts ? () => `[${ chalk.dim(dateformat(ts)) }] ` : () => '')(timestamp);

	const prefixFormatter = (pfix => pfix ? () => `[${ pfix }] ` : () => '')(prefix);

	return Object.assign(Object.create(consoleSource.Console), {
		_stdout: sOut,
		_stderr: sErr,
		threshold: verbosity ? verbosity : 3,
		emitter: willEmit && sparkles(namespace),
		matrix: {
			debug: {
				level: 5,
				stream: sOut,
				format: (pfix, msg) => `${ pfix }${ chalk.dim(msg) }`
			},
			info: {
				level: 4,
				stream: sOut,
				format: (pfix, msg) => `${ pfix }${ msg }`
			},
			log: {
				level: 3,
				stream: sOut,
				format: (pfix, msg) => `${ pfix }${ msg }`
			},
			warn: {
				level: 2,
				stream: sErr,
				format: (pfix, msg) => `${ pfix }${ chalk.yellow(msg) }`
			},
			error: {
				level: 1,
				stream: sErr,
				format: (pfix, msg) => `${ pfix }${ chalk.red(`ERROR: ${ msg }`) }`
			},
			critical: {
				level: 0,
				stream: sErr,
				format: (pfix, msg) => `${ pfix }${ chalk.bold.red(`CRITICAL: ${ msg }`) }`
			},
			panic: {
				level: 0,
				stream: sErr,
				format: (pfix, msg) => `${ pfix }${ chalk.bold.red(`PANIC: ${ msg }`) }`
			},
			emergency: {
				level: 0,
				stream: sErr,
				format: (pfix, msg) => `${ pfix }${ chalk.bold.red(`EMERGENCY: ${ msg }`) }`
			}
		},
		verbosity(level_) {
			level_ = typeof level_ === 'string' ? this.matrix[level_] : level_;
			if (level_ < 6) {
				this.threshold = level_;
			}
			return this.threshold;
		},
		canWrite(level_) {
			level_ = typeof level_ === 'string' ? this.matrix[level_] : level_;
			return this.threshold >= level_;
		},
		route(level_, msg) {
			for (var _len = arguments.length, a = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				a[_key - 2] = arguments[_key];
			}

			msg = a.length > 0 ? format(msg, ...a) : msg;
			if (willEmit) {
				this.emitter.emit(level_, msg);
			}
			if (this.threshold >= this.matrix[level_].level) {
				const pfix = `${ timeFormatter() }${ prefixFormatter() }`;
				this.matrix[level_].stream.write(`${ this.matrix[level_].format(pfix, msg) }\n`);
			}
		},
		debug(msg) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			this.route('debug', msg, ...args);
		},
		info(msg) {
			for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				args[_key3 - 1] = arguments[_key3];
			}

			this.route('info', msg, ...args);
		},
		log(msg) {
			for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				args[_key4 - 1] = arguments[_key4];
			}

			this.route('log', msg, ...args);
		},
		warn(msg) {
			for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
				args[_key5 - 1] = arguments[_key5];
			}

			this.route('warn', msg, ...args);
		},
		error(msg) {
			for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
				args[_key6 - 1] = arguments[_key6];
			}

			this.route('error', msg, ...args);
		},
		critical(msg) {
			for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
				args[_key7 - 1] = arguments[_key7];
			}

			this.route('critical', msg, ...args);
		},
		panic(msg) {
			for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
				args[_key8 - 1] = arguments[_key8];
			}

			this.route('panic', msg, ...args);
		},
		emergency(msg) {
			for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
				args[_key9 - 1] = arguments[_key9];
			}

			this.route('emergency', msg, ...args);
		},
		dir(obj) {
			let options_ = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
			var _options_$depth = options_.depth;
			const depth = _options_$depth === undefined ? 0 : _options_$depth;
			var _options_$colors = options_.colors;
			const colors = _options_$colors === undefined ? termNG.color.basic : _options_$colors;

			options_.depth = depth;
			options_.colors = colors;
			sOut.write(format(inspect(obj, options_)));
		},
		pretty(obj) {
			let depth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			sOut.write(format('Content: %s\n', inspect(obj, {
				depth,
				colors: termNG.color.basic
			}).slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
		},
		yargs(obj) {
			const parsed = {};
			Object.keys(obj).forEach(key_ => {
				const val = obj[key_];
				switch (key_) {
					case '_':
						if (val.length > 0) {
							parsed.arguments = val.join(' ');
						}
						break;
					case '$0':
						parsed.self = val;
						break;
					default:
						if (key_.length > 1) {
							parsed[key_] = val;
						}
				}
			});
			sOut.write(format('Options (yargs):\n  %s\n', inspect(parsed, {
				colors: termNG.color.basic
			}).slice(2, -1).replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
		}
	});
};

function console(options) {
	return consoleFactory(options);
}

function createConsole(options) {
	return consoleFactory(options);
}

function getVersion(level) {
	return level === undefined || level < 2 ? `${ _package.version }` : `${ _package.name } v${ _package.version }`;
}

exports.console = console;
exports.createConsole = createConsole;
exports.getVersion = getVersion;