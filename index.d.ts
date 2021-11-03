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
export class Verbosity extends Console {
    constructor({ outStream, errorStream, verbosity, timestamp, namespace, global, prefix, }?: {
        outStream: any;
        errorStream: any;
        verbosity?: number;
        timestamp: any;
        namespace: any;
        global: any;
        prefix: any;
    });
    willEmit: boolean;
    globalControl: boolean;
    timeFormatter: () => string;
    prefixFormatter: () => string;
    _stdout: any;
    _stderr: any;
    threshold: number;
    globalVerbosityController: any;
    emitter: any;
    matrix: any;
    /**
     * Set the current verbosity.
     * @param  {number|string} level - The current level (0 to 5) or level name.
     * @return {number} The current verboseness (0 to 5).
     */
    verbosity(level: number | string): number;
    /**
     * Can the requested logging level be written at this time.
     * @param  {number} level - The requested level (0 to 5).
     * @return {boolean} `true` if ok to write.
     */
    canWrite(level: number): boolean;
    /**
     * Route message and emit if required.
     * @private
     * @param  {number}    level Source logging level
     * @param  {string}    message   Message to log
     * @param  {...string} a     Additional arguments to log
     */
    private route;
    /**
     * Log a critical error message, if something breaks. (Level 1)
     * @param  {string}    message  The critical error message to log.
     * @param  {...string} args Additional arguments to log.
     */
    critical(message: string, ...args: string[]): void;
    /**
     * Log a panic error message if something unexpected happens. (Level 1)
     * @param  {string}    message  The panic message to log.
     * @param  {...string} args Additional arguments to log.
     */
    panic(message: string, ...args: string[]): void;
    /**
     * Log a emergency message, for when something needs emergency attention. (Level 1)
     * @param  {string}    message  The debug message to log.
     * @param  {...string} args Additional arguments to log.
     */
    emergency(message: string, ...args: string[]): void;
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
    pretty(object: object, depth?: number, color?: boolean): void;
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
    yargs(object: object, color?: boolean): void;
}
/**
 * Create a new Verbosity object.
 * @param  {object} options Options to pass to the factory.
 * @return {Verbosity} Verbosity's console object.
 */
export function createConsole(options: object): Verbosity;
/**
 * Return the modules version metadata.
 * @function
 * @param  {number} level Version format required.
 * @return {string} The version string.
 */
export function getVersion(level: number): string;
