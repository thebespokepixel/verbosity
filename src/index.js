/* ──────────╮
 │ verbosity │ Verbosity Controlling Console Writer/Emitter
 ╰───────────┴────────────────────────────────────────────────────────────────── */

import meta from '@thebespokepixel/meta'
import Verbosity from './lib/verbosity.class'

const metadata = meta(__dirname)

/**
 * Create a new Verbosity object.
 * @param  {Object} options Options to pass to the factory.
 * @return {Verbosity} Verbosity's console object.
 */
export function createConsole(options) {
	return new Verbosity(options)
}

/**
 * Return the modules version metadata.
 * @function
 * @param  {Number} level Version format required.
 * @return {String} The version string.
 */
export const getVersion = level => metadata.version(level)

export {Verbosity}
