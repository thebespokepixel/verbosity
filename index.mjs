import meta from '@thebespokepixel/meta';
import util from 'util';
import termNG from 'term-ng';
import chalk from 'chalk';
import sparkles from 'sparkles';
import { bespokeTimeFormat } from '@thebespokepixel/time';

function matrix(sOut, sErr) {
  return {
    debug: {
      level: 5,
      stream: sOut,
      format: (pfix, message) => `${pfix}${chalk.dim(message)}`
    },
    info: {
      level: 4,
      stream: sOut,
      format: (pfix, message) => `${pfix}${message}`
    },
    log: {
      level: 3,
      stream: sOut,
      format: (pfix, message) => `${pfix}${message}`
    },
    warn: {
      level: 2,
      stream: sErr,
      format: (pfix, message) => `${pfix}${chalk.yellow(message)}`
    },
    error: {
      level: 1,
      stream: sErr,
      format: (pfix, message) => `${pfix}${chalk.red(`ERROR: ${message}`)}`
    },
    critical: {
      level: 0,
      stream: sErr,
      format: (pfix, message) => `${pfix}${chalk.bold.red(`CRITICAL: ${message}`)}`
    },
    panic: {
      level: 0,
      stream: sErr,
      format: (pfix, message) => `${pfix}${chalk.bold.red(`PANIC: ${message}`)}`
    },
    emergency: {
      level: 0,
      stream: sErr,
      format: (pfix, message) => `${pfix}${chalk.bold.red(`EMERGENCY: ${message}`)}`
    }
  };
}

const {
  format,
  inspect
} = util;
const {
  Console
} = console;
class Verbosity extends Console {
  constructor({
    outStream,
    errorStream,
    verbosity = 3,
    timestamp,
    namespace,
    global,
    prefix
  } = {}) {
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

    super(sOut, sErr);
    this.willEmit = Boolean(namespace);
    this.globalControl = Boolean(global);

    this.timeFormatter = (ts => ts ? () => `[${chalk.dim(bespokeTimeFormat(ts))}] ` : () => '')(timestamp);

    this.prefixFormatter = (pfix => pfix ? () => `[${pfix}] ` : () => '')(prefix);

    this._stdout = sOut;
    this._stderr = sErr;
    this.threshold = verbosity;
    this.globalVerbosityController = this.globalControl && sparkles('verbosityGlobal');
    this.emitter = this.willEmit && sparkles(namespace);
    this.matrix = matrix(sOut, sErr);

    if (this.globalControl) {
      this.globalVerbosityController.on('level', ({
        level
      }) => {
        this.threshold = level;
      });
    }
  }

  verbosity(level) {
    if (level) {
      level = typeof level === 'string' ? this.matrix[level].level : level;

      if (level < 6) {
        this.threshold = level;
      }

      if (this.globalControl) {
        this.globalVerbosityController.emit('level', {
          level
        });
      }
    }

    return this.threshold;
  }

  canWrite(level) {
    level = typeof level === 'string' ? this.matrix[level] : level;
    return this.threshold >= level;
  }

  route(level, message, ...a) {
    message = a.length > 0 ? format(message, ...a) : message;

    if (this.willEmit) {
      this.emitter.emit(level, message);
    }

    if (this.threshold >= this.matrix[level].level) {
      const pfix = `${this.timeFormatter()}${this.prefixFormatter()}`;
      this.matrix[level].stream.write(`${this.matrix[level].format(pfix, message)}\n`);
    }
  }

  debug(message, ...args) {
    this.route('debug', message, ...args);
  }

  info(message, ...args) {
    this.route('info', message, ...args);
  }

  log(message, ...args) {
    this.route('log', message, ...args);
  }

  warn(message, ...args) {
    this.route('warn', message, ...args);
  }

  error(message, ...args) {
    this.route('error', message, ...args);
  }

  critical(message, ...args) {
    this.route('critical', message, ...args);
  }

  panic(message, ...args) {
    this.route('panic', message, ...args);
  }

  emergency(message, ...args) {
    this.route('emergency', message, ...args);
  }

  dir(object, options = {}) {
    const {
      depth = 0,
      colors = termNG.color.basic
    } = options;
    options.depth = depth;
    options.colors = colors;

    this._stdout.write(format(inspect(object, options)));
  }

  pretty(object, depth = 0, color = true) {
    this._stdout.write(format('Content: %s\n', inspect(object, {
      depth,
      colors: color && termNG.color.basic
    }).slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/(\w+):/g, '$1 ▸').replace(/,\n/g, '\n')));
  }

  yargs(object, color = true) {
    const parsed = {};
    Object.keys(object).forEach(key_ => {
      const value = object[key_];

      switch (key_) {
        case '_':
          if (value.length > 0) {
            parsed.arguments = value.join(' ');
          }

          break;

        case '$0':
          parsed.self = value;
          break;

        default:
          if (key_.length > 1) {
            parsed[key_] = value;
          }

      }
    });

    this._stdout.write(format('Options (yargs):\n  %s\n', inspect(parsed, {
      colors: color && termNG.color.basic
    }).slice(2, -1).replace(/(\w+):/g, '$1 ▸').replace(/,\n/g, '\n')));
  }

}

const metadata = meta(__dirname);
function createConsole(options) {
  return new Verbosity(options);
}
const getVersion = level => metadata.version(level);

export { Verbosity, createConsole, getVersion };
