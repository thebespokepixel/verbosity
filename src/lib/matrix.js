import chalk from 'chalk'

/**
 * Message routing and formatting matrix.
 * @private
 * @type {Object}
 * @param {Stream} sOut Output stream.
 * @param {Stream} sErr Error stream.
 * @returns {Object} Routing matrix object.
 */
export default function matrix(sOut, sErr) {
	return {
		debug: {
			level: 5,
			stream: sOut,
			/**
			 * Format the debug message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.dim(message)}`
		},
		info: {
			level: 4,
			stream: sOut,
			/**
			 * Format the info message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${message}`
		},
		log: {
			level: 3,
			stream: sOut,
			/**
			 * Format the log message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${message}`
		},
		warn: {
			level: 2,
			stream: sErr,
			/**
			 * Format the warn message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.yellow(message)}`
		},
		error: {
			level: 1,
			stream: sErr,
			/**
			 * Format the error message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.red(`ERROR: ${message}`)}`
		},
		critical: {
			level: 0,
			stream: sErr,
			/**
			 * Format the critical message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.bold.red(`CRITICAL: ${message}`)}`
		},
		panic: {
			level: 0,
			stream: sErr,
			/**
			 * Format the panic message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.bold.red(`PANIC: ${message}`)}`
		},
		emergency: {
			level: 0,
			stream: sErr,
			/**
			 * Format the emergency message.
			 * @private
			 * @param  {String} pfix Message prefix.
			 * @param  {String} message  The message body.
			 * @return {Sring} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.bold.red(`EMERGENCY: ${message}`)}`
		}
	}
}
