/* ──────────╮
 │ verbosity │ Verbosity Controlling Console Writer/Emitter
 ╰───────────┴────────────────────────────────────────────────────────────────── */
/* eslint node/prefer-global/process: [error] */

import {format, inspect} from 'node:util'
import {Console} from 'node:console'
import termNG from 'term-ng'
import chalk from 'chalk'
import sparkles from 'sparkles'
import {bespokeTimeFormat} from '@thebespokepixel/time'
import matrix from './matrix.js'

/**
 * Generate a verbosity console
 * @param {object} options                      - Configuration options.
 * @param {stream.writable} options.outStream   - Stream to write normal output
 * @param {stream.writable} options.errorStream - Stream to write error output
 * @param {number} options.verbosity            - The verboseness of output:
 *                                              0: Mute
 *                                              1: Errors
 *                                              2: Notice
 *                                              3: Log
 *                                              4: Info
 *                                              5: Debug
 * @param {string} options.timestamp            - Timestamp format.
 * @param {string} options.namespace            - Sparkles namespace to emit events to.
 * @param {boolean} options.global              - Should changes to verbosity be made globally?
 * @param {string} options.prefix               - Logging message prefix.
 * @return {Verbosity} Verbosity's console object.
 */
export default class Verbosity extends Console {
	constructor({
		outStream,
		errorStream,
		verbosity = 3,
		timestamp,
		namespace,
		global,
		prefix,
	} = {}) {
		const sOut = (ws => {
			if (!ws.writable) {
				throw new Error('Provided output stream must be writable')
			}

			return ws
		})(outStream ? outStream : process.stdout)

		const sError = (ws => {
			if (!ws.writable) {
				throw new Error('Provided error stream must be writable')
			}

			return ws
		})(errorStream ? errorStream : sOut)

		super(sOut, sError)
		this.willEmit = Boolean(namespace)
		this.globalControl = Boolean(global)

		this.timeFormatter = (ts => ts
			? () => `[${chalk.dim(bespokeTimeFormat(ts))}] `
			: () => ''
		)(timestamp)

		this.prefixFormatter = (pfix => pfix
			? () => `[${pfix}] `
			: () => ''
		)(prefix)

		this._stdout = sOut
		this._stderr = sError
		this.threshold = verbosity
		this.globalVerbosityController = this.globalControl && sparkles('verbosityGlobal')
		this.emitter = this.willEmit && sparkles(namespace)
		this.matrix = matrix(sOut, sError)

		if (this.globalControl) {
			this.globalVerbosityController.on('level', ({level}) => {
				this.threshold = level
			})
		}
	}

	/**
	 * Set the current verbosity.
	 * @param  {number|string} level - The current level (0 to 5) or level name.
	 * @return {number} The current verboseness (0 to 5).
	 */
	verbosity(level) {
		if (level) {
			level = (typeof level === 'string') ? this.matrix[level].level : level

			if (level < 6) {
				this.threshold = level
			}

			if (this.globalControl) {
				this.globalVerbosityController.emit('level', {level})
			}
		}

		return this.threshold
	}

	/**
	 * Can the requested logging level be written at this time.
	 * @param  {number} level - The requested level (0 to 5).
	 * @return {boolean} `true` if ok to write.
	 */
	canWrite(level) {
		level = (typeof level === 'string') ? this.matrix[level] : level
		return this.threshold >= level
	}

	/**
	 * Route message and emit if required.
	 * @private
	 * @param  {number}    level Source logging level
	 * @param  {string}    message   Message to log
	 * @param  {...string} a     Additional arguments to log
	 */
	route(level, message, ...a) {
		message = (a.length > 0) ? format(message, ...a) : message
		if (this.willEmit) {
			this.emitter.emit(level, message)
		}

		if (this.threshold >= this.matrix[level].level) {
			const pfix = `${this.timeFormatter()}${this.prefixFormatter()}`
			this.matrix[level].stream.write(`${this.matrix[level].format(pfix, message)}\n`)
		}
	}

	/**
	 * Log a debug message. (Level 5)
	 * @param  {string}    message  The debug message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	debug(message, ...args) {
		this.route('debug', message, ...args)
	}

	/**
	 * Log an info message. (Level 4)
	 * @param  {string}    message  The info message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	info(message, ...args) {
		this.route('info', message, ...args)
	}

	/**
	 * Log a normal message. (Level 3)
	 * @param  {string}    message  The normal message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	log(message, ...args) {
		this.route('log', message, ...args)
	}

	/**
	 * Log a warning message. (Level 2)
	 * @param  {string}    message  The warning message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	warn(message, ...args) {
		this.route('warn', message, ...args)
	}

	/**
	 * Log an error message. (Level 1)
	 * @param  {string}    message  The error message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	error(message, ...args) {
		this.route('error', message, ...args)
	}

	/**
	 * Log a critical error message, if something breaks. (Level 1)
	 * @param  {string}    message  The critical error message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	critical(message, ...args) {
		this.route('critical', message, ...args)
	}

	/**
	 * Log a panic error message if something unexpected happens. (Level 1)
	 * @param  {string}    message  The panic message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	panic(message, ...args) {
		this.route('panic', message, ...args)
	}

	/**
	 * Log a emergency message, for when something needs emergency attention. (Level 1)
	 * @param  {string}    message  The debug message to log.
	 * @param  {...string} args Additional arguments to log.
	 */
	emergency(message, ...args) {
		this.route('emergency', message, ...args)
	}

	/**
	 * As console.dir, but defaults to colour (if appropriate) and zero depth.
	 * @param  {object} object     The Object to print.
	 * @param  {object} options As console.dir options object.
	 */
	dir(object, options = {}) {
		const {depth = 0, colors = termNG.color.basic} = options
		options.depth = depth
		options.colors = colors
		this._stdout.write(format(inspect(object, options)))
	}

	/**
	 * Pretty prints object, similar to OS X's plutil -p. Defaults to zero depth.
	 * @param  {object} object   The Object to print.
	 * @param  {number} depth How many object levels to print.
	 * @param  {boolean} color Print output in color, if supported.
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
	pretty(object, depth = 0, color = true) {
		this._stdout.write(format('Content: %s\n', inspect(object, {
			depth,
			colors: color && termNG.color.basic,
		})
			.slice(0, -1)
			.replace(/^{/, 'Object\n ')
			.replace(/^\[/, 'Array\n ')
			.replace(/^(\w+) {/, '$1')
			.replace(/(\w+):/g, '$1 ▸')
			.replace(/,\n/g, '\n'),
		))
	}

	/**
	 * Helper function for pretty printing a summary of the current 'yargs' options.
	 *
	 * Only prints 'long options', `._` as 'arguments' and `$0` as 'self'.
	 * @param  {object} object The Yargs argv object to print.
	 * @param  {boolean} color Print output in color, if supported.
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
	yargs(object, color = true) {
		const parsed = {}

		for (const key_ of Object.keys(object)) {
			const value = object[key_]
			switch (key_) {
				case '_':
					if (value.length > 0) {
						parsed.arguments = value.join(' ')
					}

					break
				case '$0':
					parsed.self = value
					break
				default:
					if (key_.length > 1) {
						parsed[key_] = value
					}
			}
		}

		this._stdout.write(format('Options (yargs):\n  %s\n', inspect(parsed, {
			colors: color && termNG.color.basic,
		})
			.slice(2, -1)
			.replace(/(\w+):/g, '$1 ▸')
			.replace(/,\n/g, '\n')))
	}
}
