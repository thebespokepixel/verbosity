/* ──────────╮
 │ verbosity │ Verbosity Controlling Console Writer/Emitter
 ╰───────────┴────────────────────────────────────────────────────────────────── */

import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import meta from '@thebespokepixel/meta'
import Verbosity from './lib/verbosity'

const metadata = meta(dirname(fileURLToPath(import.meta.url)))

/**
 * Create a new Verbosity object.
 * @param  {object} options Options to pass to the factory.
 * @return {Verbosity} Verbosity's console object.
 */
export function createConsole(options) {
	return new Verbosity(options)
}

/**
 * Return the modules version metadata.
 * @function
 * @param  {number} level Version format required.
 * @return {string} The version string.
 */
export const getVersion = level => metadata.version(level)

export {Verbosity}
