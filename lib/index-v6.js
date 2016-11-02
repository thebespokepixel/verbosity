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

const consoleFactory = function consoleFactory(options = {}) {
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

		route(level, msg, ...a) {
			msg = a.length > 0 ? format(msg, ...a) : msg;
			if (willEmit) {
				this.emitter.emit(level, msg);
			}
			if (this.threshold >= this.matrix[level].level) {
				const pfix = `${ timeFormatter() }${ prefixFormatter() }`;
				this.matrix[level].stream.write(`${ this.matrix[level].format(pfix, msg) }\n`);
			}
		},

		debug(msg, ...args) {
			this.route('debug', msg, ...args);
		},

		info(msg, ...args) {
			this.route('info', msg, ...args);
		},

		log(msg, ...args) {
			this.route('log', msg, ...args);
		},

		warn(msg, ...args) {
			this.route('warn', msg, ...args);
		},

		error(msg, ...args) {
			this.route('error', msg, ...args);
		},

		critical(msg, ...args) {
			this.route('critical', msg, ...args);
		},

		panic(msg, ...args) {
			this.route('panic', msg, ...args);
		},

		emergency(msg, ...args) {
			this.route('emergency', msg, ...args);
		},

		dir(obj, options = {}) {
			var _options$depth = options.depth;
			const depth = _options$depth === undefined ? 0 : _options$depth;
			var _options$colors = options.colors;
			const colors = _options$colors === undefined ? termNG.color.basic : _options$colors;

			options.depth = depth;
			options.colors = colors;
			sOut.write(format(inspect(obj, options)));
		},

		pretty(obj, depth = 0) {
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
