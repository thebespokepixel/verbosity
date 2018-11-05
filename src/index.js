/* ──────────╮
 │ verbosity │ Verbosity Controlling Console Writer/Emitter
 ╰───────────┴────────────────────────────────────────────────────────────────── */

import util from 'util'

import {Console} from 'console'

import termNG from 'term-ng'
import chalk from 'chalk'
import sparkles from 'sparkles'
import {bespokeTimeFormat} from '@thebespokepixel/time'
import meta from '@thebespokepixel/meta'

const {format} = util
const {inspect} = util
const metadata = meta(__dirname)

/**
 * Generate a verbosity console
 * @param  {Object} options                     - Configuration options.
 * @param {stream.writable} options.outStream   - Stream to write normal output
 * @param {stream.writable} options.errorStream - Stream to write error output
 * @param {Number} options.verbosity            - The verboseness of output:
 *                                              0: Mute
 *                                              1: Errors
 *                                              2: Notice
 *                                              3: Log
 *                                              4: Info
 *                                              5: Debug
 * @param {String} options.timestamp            - Timestamp format.
 * @param {String} options.namespace            - Sparkles namespace to emit events to.
 * @param {String} options.prefix               - Logging message prefix.
 * @return {VerbosityConsole} Verbosity's console object.
 */
const consoleFactory = function (options = {}) {
	const {
		outStream, errorStream, verbosity, timestamp, namespace, prefix
	} = options

	const sOut = (ws => {
		if (!ws.writable) {
			throw new Error('Provided output stream must be writable')
		}
		return ws
	})(outStream ? outStream : process.stdout)

	const sErr = (ws => {
		if (!ws.writable) {
			throw new Error('Provided error stream must be writable')
		}
		return ws
	})(errorStream ? errorStream : sOut)

	const willEmit = Boolean(namespace)

	const timeFormatter = (ts => ts ?
		() => `[${chalk.dim(bespokeTimeFormat(ts))}] ` :
		() => ''
	)(timestamp)

	const prefixFormatter = (pfix => pfix ?
		() => `[${pfix}] ` :
		() => ''
	)(prefix)

	return Object.assign(new Console(sOut, sErr), {
		_stdout: sOut,
		_stderr: sErr,
		threshold: verbosity ? verbosity : 3,
		emitter: willEmit && sparkles(namespace),
		/**
		 * Message routing and formatting matrix.
		 * @private
		 * @type {Object}
		 */
		matrix: {
			debug: {
				level: 5,
				stream: sOut,
				/**
				 * Format the debug message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${chalk.dim(msg)}`
			},
			info: {
				level: 4,
				stream: sOut,
				/**
				 * Format the info message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${msg}`
			},
			log: {
				level: 3,
				stream: sOut,
				/**
				 * Format the log message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${msg}`
			},
			warn: {
				level: 2,
				stream: sErr,
				/**
				 * Format the warn message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${chalk.yellow(msg)}`
			},
			error: {
				level: 1,
				stream: sErr,
				/**
				 * Format the error message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${chalk.red(`ERROR: ${msg}`)}`
			},
			critical: {
				level: 0,
				stream: sErr,
				/**
				 * Format the critical message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${chalk.bold.red(`CRITICAL: ${msg}`)}`
			},
			panic: {
				level: 0,
				stream: sErr,
				/**
				 * Format the panic message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${chalk.bold.red(`PANIC: ${msg}`)}`
			},
			emergency: {
				level: 0,
				stream: sErr,
				/**
				 * Format the emergency message.
				 * @private
				 * @param  {String} pfix Message prefix.
				 * @param  {String} msg  The message body.
				 * @return {Sring} The formatted mesage.
				 */
				format: (pfix, msg) => `${pfix}${chalk.bold.red(`EMERGENCY: ${msg}`)}`
			}
		},
		/**
		 * Set the current verbosity.
		 * @param  {Number} level - The current level (0 to 5).
		 * @return {Number} The current verboseness (0 to 5).
		 */
		verbosity(level) {
			level = (typeof level === 'string') ? this.matrix[level] : level
			if (level < 6) {
				this.threshold = level
			}
			return this.threshold
		},
		/**
		 * Can the requested logging level be written at this time.
		 * @param  {Number} level - The requested level (0 to 5).
		 * @return {Boolean} `true` if ok to write.
		 */
		canWrite(level) {
			level = (typeof level === 'string') ? this.matrix[level] : level
			return this.threshold >= level
		},
		/**
		 * Route message and emit if required.
		 * @private
		 * @param  {Number}    level Source logging level
		 * @param  {String}    msg   Message to log
		 * @param  {...String} a     Additional arguments to log
		 */
		route(level, msg, ...a) {
			msg = (a.length > 0) ? format(msg, ...a) : msg
			if (willEmit) {
				this.emitter.emit(level, msg)
			}
			if (this.threshold >= this.matrix[level].level) {
				const pfix = `${timeFormatter()}${prefixFormatter()}`
				this.matrix[level].stream.write(`${this.matrix[level].format(pfix, msg)}\n`)
			}
		},
		/**
		 * Log a debug message. (Level 5)
		 * @param  {String}    msg  The debug message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		debug(msg, ...args) {
			this.route('debug', msg, ...args)
		},
		/**
		 * Log an info message. (Level 4)
		 * @param  {String}    msg  The info message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		info(msg, ...args) {
			this.route('info', msg, ...args)
		},
		/**
		 * Log a normal message. (Level 3)
		 * @param  {String}    msg  The normal message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		log(msg, ...args) {
			this.route('log', msg, ...args)
		},
		/**
		 * Log a warning message. (Level 2)
		 * @param  {String}    msg  The warning message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		warn(msg, ...args) {
			this.route('warn', msg, ...args)
		},
		/**
		 * Log an error message. (Level 1)
		 * @param  {String}    msg  The error message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		error(msg, ...args) {
			this.route('error', msg, ...args)
		},
		/**
		 * Log a critical error message, if something breaks. (Level 1)
		 * @param  {String}    msg  The critical error message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		critical(msg, ...args) {
			this.route('critical', msg, ...args)
		},
		/**
		 * Log a panic error message if something unexpected happens. (Level 1)
		 * @param  {String}    msg  The panic message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		panic(msg, ...args) {
			this.route('panic', msg, ...args)
		},
		/**
		 * Log a emergency message, for when something needs emergency attention. (Level 1)
		 * @param  {String}    msg  The debug message to log.
		 * @param  {...String} args Additional arguments to log.
		 */
		emergency(msg, ...args) {
			this.route('emergency', msg, ...args)
		},
		/**
		 * As console.dir, but defaults to colour (if appropriate) and zero depth.
		 * @param  {Object} obj     The Object to print.
		 * @param  {Object} options As console.dir options object.
		 */
		dir(obj, options = {}) {
			const {depth = 0, colors = termNG.color.basic} = options
			options.depth = depth
			options.colors = colors
			sOut.write(format(inspect(obj, options)))
		},
		/**
		 * Pretty prints object, similar to OS X's plutil -p. Defaults to zero depth.
		 * @param  {Object} obj   The Object to print.
		 * @param  {Number} depth How many object levels to print.
		 * @example
		 * console.pretty(console)
		 *
		 * // Outputs:
		 *	Object: VerbosityMatrix
		 *	  critical ▸ [Function]
		 *	  error ▸ [Function ▸ bound ]
		 *	  warn ▸ [Function ▸ bound ]
		 *	  log ▸ [Function ▸ bound ]
		 *	  info ▸ [Function ▸ bound ]
		 *	  debug ▸ [Function]
		 *	  canWrite ▸ [Function]
		 *	  ...
		 */
		pretty(obj, depth = 0, color = true) {
			sOut.write(format('Content: %s\n', inspect(obj, {
				depth,
				colors: color && termNG.color.basic
			})
				.slice(0, -1)
				.replace(/^{/, 'Object\n ')
				.replace(/^\[/, 'Array\n ')
				.replace(/^(\w+) {/, '$1')
				.replace(/(\w+):/g, '$1 ▸')
				.replace(/,\n/g, '\n')
			))
		},
		/**
		 * Helper function for pretty printing a summary of the current 'yargs' options.
		 *
		 * Only prints 'long options', `._` as 'arguments' and `$0` as 'self'.
		 * @param  {Object} obj The Yargs argv object to print.
		 * @example
		 * console.yargs(yargs)
		 *
		 * // Outputs:
		 * Object (yargs):
		 *   left ▸ 2
		 *   right ▸ 2
		 *   mode ▸ 'hard'
		 *   encoding ▸ 'utf8'
		 *   ...
		 *   self ▸ '/usr/local/bin/truwrap'
		 */
		yargs(obj) {
			const parsed = {}
			Object.keys(obj).forEach(key_ => {
				const val = obj[key_]
				switch (key_) {
					case '_':
						if (val.length > 0) {
							parsed.arguments = val.join(' ')
						}
						break
					case '$0':
						parsed.self = val
						break
					default:
						if (key_.length > 1) {
							parsed[key_] = val
						}
				}
			})
			sOut.write(format('Options (yargs):\n  %s\n', inspect(parsed, {
				colors: termNG.color.basic
			})
				.slice(2, -1)
				.replace(/:/g, ' ▸')
				.replace(/,\n/g, '\n')))
		}
	})
}

/**
 * Create a new VerbosityConsole object.
 * @private
 * @deprecated Use `createConsole` instead.
 * @param  {Object} options Options to pass to the factory.
 * @return {VerbosityConsole} Verbosity's console object.
 */
export function console(options) {
	return consoleFactory(options)
}

/**
 * Create a new VerbosityConsole object.
 * @param  {Object} options Options to pass to the factory.
 * @return {VerbosityConsole} Verbosity's console object.
 */
export function createConsole(options) {
	return consoleFactory(options)
}

/**
 * Return the modules version metadata.
 * @function
 * @param  {Number} level Version format required.
 * @return {String} The version string.
 */
export const getVersion = level => metadata.version(level)
