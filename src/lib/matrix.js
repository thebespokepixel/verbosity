import chalk from 'chalk'

/**
 * Message routing and formatting matrix.
 * @private
 * @type {object}
 * @param {Stream} sOut Output stream.
 * @param {Stream} sErr Error stream.
 * @returns {object} Routing matrix object.
 */
export default function matrix(sOut, sError) {
	return {
		debug: {
			level: 5,
			stream: sOut,
			/**
			 * Format the debug message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.dim(message)}`,
		},
		info: {
			level: 4,
			stream: sOut,
			/**
			 * Format the info message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${message}`,
		},
		log: {
			level: 3,
			stream: sOut,
			/**
			 * Format the log message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${message}`,
		},
		warn: {
			level: 2,
			stream: sError,
			/**
			 * Format the warn message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.yellow(message)}`,
		},
		error: {
			level: 1,
			stream: sError,
			/**
			 * Format the error message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.red(`ERROR: ${message}`)}`,
		},
		critical: {
			level: 0,
			stream: sError,
			/**
			 * Format the critical message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.bold.red(`CRITICAL: ${message}`)}`,
		},
		panic: {
			level: 0,
			stream: sError,
			/**
			 * Format the panic message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.bold.red(`PANIC: ${message}`)}`,
		},
		emergency: {
			level: 0,
			stream: sError,
			/**
			 * Format the emergency message.
			 * @private
			 * @param  {string} pfix Message prefix.
			 * @param  {string} message  The message body.
			 * @return {string} The formatted mesage.
			 */
			format: (pfix, message) => `${pfix}${chalk.bold.red(`EMERGENCY: ${message}`)}`,
		},
	}
}
