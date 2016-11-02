'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var util = _interopDefault(require('util'));
var _console = _interopDefault(require('console'));
var termNG = _interopDefault(require('term-ng'));
var chalk = _interopDefault(require('chalk'));
var sparkles = _interopDefault(require('sparkles'));
var _thebespokepixel_time = require('@thebespokepixel/time');
var meta = _interopDefault(require('@thebespokepixel/meta'));

const format = util.format;
const inspect = util.inspect;
const metadata = meta(__dirname);

const consoleFactory = function consoleFactory() {
	let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	const outStream = options.outStream,
	      errorStream = options.errorStream,
	      verbosity = options.verbosity,
	      timestamp = options.timestamp,
	      namespace = options.namespace,
	      prefix = options.prefix;


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

	const timeFormatter = (ts => ts ? () => `[${ chalk.dim(_thebespokepixel_time.bespokeTimeFormat(ts)) }] ` : () => '')(timestamp);

	const prefixFormatter = (pfix => pfix ? () => `[${ pfix }] ` : () => '')(prefix);

	return Object.assign(Object.create(_console.Console), {
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

		verbosity(level) {
			level = typeof level === 'string' ? this.matrix[level] : level;
			if (level < 6) {
				this.threshold = level;
			}
			return this.threshold;
		},

		canWrite(level) {
			level = typeof level === 'string' ? this.matrix[level] : level;
			return this.threshold >= level;
		},

		route(level, msg) {
			for (var _len = arguments.length, a = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				a[_key - 2] = arguments[_key];
			}

			msg = a.length > 0 ? format.apply(undefined, [msg].concat(a)) : msg;
			if (willEmit) {
				this.emitter.emit(level, msg);
			}
			if (this.threshold >= this.matrix[level].level) {
				const pfix = `${ timeFormatter() }${ prefixFormatter() }`;
				this.matrix[level].stream.write(`${ this.matrix[level].format(pfix, msg) }\n`);
			}
		},

		debug(msg) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			this.route.apply(this, ['debug', msg].concat(args));
		},

		info(msg) {
			for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				args[_key3 - 1] = arguments[_key3];
			}

			this.route.apply(this, ['info', msg].concat(args));
		},

		log(msg) {
			for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				args[_key4 - 1] = arguments[_key4];
			}

			this.route.apply(this, ['log', msg].concat(args));
		},

		warn(msg) {
			for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
				args[_key5 - 1] = arguments[_key5];
			}

			this.route.apply(this, ['warn', msg].concat(args));
		},

		error(msg) {
			for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
				args[_key6 - 1] = arguments[_key6];
			}

			this.route.apply(this, ['error', msg].concat(args));
		},

		critical(msg) {
			for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
				args[_key7 - 1] = arguments[_key7];
			}

			this.route.apply(this, ['critical', msg].concat(args));
		},

		panic(msg) {
			for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
				args[_key8 - 1] = arguments[_key8];
			}

			this.route.apply(this, ['panic', msg].concat(args));
		},

		emergency(msg) {
			for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
				args[_key9 - 1] = arguments[_key9];
			}

			this.route.apply(this, ['emergency', msg].concat(args));
		},

		dir(obj) {
			let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var _options$depth = options.depth;
			const depth = _options$depth === undefined ? 0 : _options$depth;
			var _options$colors = options.colors;
			const colors = _options$colors === undefined ? termNG.color.basic : _options$colors;

			options.depth = depth;
			options.colors = colors;
			sOut.write(format(inspect(obj, options)));
		},

		pretty(obj) {
			let depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

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

const getVersion = level => metadata.version(level);

exports.console = console;
exports.createConsole = createConsole;
exports.getVersion = getVersion;
