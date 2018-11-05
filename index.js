'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var util = _interopDefault(require('util'));
var console = require('console');
var termNG = _interopDefault(require('term-ng'));
var chalk = _interopDefault(require('chalk'));
var sparkles = _interopDefault(require('sparkles'));
var time = require('@thebespokepixel/time');
var meta = _interopDefault(require('@thebespokepixel/meta'));

const {
  format
} = util;
const {
  inspect
} = util;
const metadata = meta(__dirname);

const consoleFactory = function (options = {}) {
  const {
    outStream,
    errorStream,
    verbosity,
    timestamp,
    namespace,
    prefix
  } = options;

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

  const timeFormatter = (ts => ts ? () => `[${chalk.dim(time.bespokeTimeFormat(ts))}] ` : () => '')(timestamp);

  const prefixFormatter = (pfix => pfix ? () => `[${pfix}] ` : () => '')(prefix);

  return Object.assign(new console.Console(sOut, sErr), {
    _stdout: sOut,
    _stderr: sErr,
    threshold: verbosity ? verbosity : 3,
    emitter: willEmit && sparkles(namespace),

    matrix: {
      debug: {
        level: 5,
        stream: sOut,

        format: (pfix, msg) => `${pfix}${chalk.dim(msg)}`
      },
      info: {
        level: 4,
        stream: sOut,

        format: (pfix, msg) => `${pfix}${msg}`
      },
      log: {
        level: 3,
        stream: sOut,

        format: (pfix, msg) => `${pfix}${msg}`
      },
      warn: {
        level: 2,
        stream: sErr,

        format: (pfix, msg) => `${pfix}${chalk.yellow(msg)}`
      },
      error: {
        level: 1,
        stream: sErr,

        format: (pfix, msg) => `${pfix}${chalk.red(`ERROR: ${msg}`)}`
      },
      critical: {
        level: 0,
        stream: sErr,

        format: (pfix, msg) => `${pfix}${chalk.bold.red(`CRITICAL: ${msg}`)}`
      },
      panic: {
        level: 0,
        stream: sErr,

        format: (pfix, msg) => `${pfix}${chalk.bold.red(`PANIC: ${msg}`)}`
      },
      emergency: {
        level: 0,
        stream: sErr,

        format: (pfix, msg) => `${pfix}${chalk.bold.red(`EMERGENCY: ${msg}`)}`
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
        const pfix = `${timeFormatter()}${prefixFormatter()}`;
        this.matrix[level].stream.write(`${this.matrix[level].format(pfix, msg)}\n`);
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
      const {
        depth = 0,
        colors = termNG.color.basic
      } = options;
      options.depth = depth;
      options.colors = colors;
      sOut.write(format(inspect(obj, options)));
    },

    pretty(obj, depth = 0, color = true) {
      sOut.write(format('Content: %s\n', inspect(obj, {
        depth,
        colors: color && termNG.color.basic
      }).slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/(\w+):/g, '$1 ▸').replace(/,\n/g, '\n')));
    },

    yargs(obj, color = true) {
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
        colors: color && termNG.color.basic
      }).slice(2, -1).replace(/(\w+):/g, '$1 ▸').replace(/,\n/g, '\n')));
    }

  });
};


function console$1(options) {
  return consoleFactory(options);
}

function createConsole(options) {
  return consoleFactory(options);
}

const getVersion = level => metadata.version(level);

exports.console = console$1;
exports.createConsole = createConsole;
exports.getVersion = getVersion;
