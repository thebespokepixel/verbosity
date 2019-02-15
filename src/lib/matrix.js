import chalk from 'chalk'

export default function matrix(sOut, sErr) {
	return {
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
	}
}
