import chalk from 'chalk';
import util from 'util';
import termNG from 'term-ng';
import sparkles from 'sparkles';
import { bespokeTimeFormat } from '@thebespokepixel/time';
import meta from '@thebespokepixel/meta';

function matrix(sOut, sErr) {
  return {
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
    verbosity,
    timestamp,
    namespace,
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

    this.timeFormatter = (ts => ts ? () => `[${chalk.dim(bespokeTimeFormat(ts))}] ` : () => '')(timestamp);

    this.prefixFormatter = (pfix => pfix ? () => `[${pfix}] ` : () => '')(prefix);

    this._stdout = sOut;
    this._stderr = sErr;
    this.threshold = verbosity ? verbosity : 3;
    this.emitter = this.willEmit && sparkles(namespace);
    this.matrix = matrix(sOut, sErr);
  }

  verbosity(level) {
    level = typeof level === 'string' ? this.matrix[level] : level;

    if (level < 6) {
      this.threshold = level;
    }

    return this.threshold;
  }

  canWrite(level) {
    level = typeof level === 'string' ? this.matrix[level] : level;
    return this.threshold >= level;
  }

  route(level, msg, ...a) {
    msg = a.length > 0 ? format(msg, ...a) : msg;

    if (this.willEmit) {
      this.emitter.emit(level, msg);
    }

    if (this.threshold >= this.matrix[level].level) {
      const pfix = `${this.timeFormatter()}${this.prefixFormatter()}`;
      this.matrix[level].stream.write(`${this.matrix[level].format(pfix, msg)}\n`);
    }
  }

  debug(msg, ...args) {
    this.route('debug', msg, ...args);
  }

  info(msg, ...args) {
    this.route('info', msg, ...args);
  }

  log(msg, ...args) {
    this.route('log', msg, ...args);
  }

  warn(msg, ...args) {
    this.route('warn', msg, ...args);
  }

  error(msg, ...args) {
    this.route('error', msg, ...args);
  }

  critical(msg, ...args) {
    this.route('critical', msg, ...args);
  }

  panic(msg, ...args) {
    this.route('panic', msg, ...args);
  }

  emergency(msg, ...args) {
    this.route('emergency', msg, ...args);
  }

  dir(obj, options = {}) {
    const {
      depth = 0,
      colors = termNG.color.basic
    } = options;
    options.depth = depth;
    options.colors = colors;

    this._stdout.write(format(inspect(obj, options)));
  }

  pretty(obj, depth = 0, color = true) {
    this._stdout.write(format('Content: %s\n', inspect(obj, {
      depth,
      colors: color && termNG.color.basic
    }).slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/(\w+):/g, '$1 ▸').replace(/,\n/g, '\n')));
  }

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

export { createConsole, getVersion, Verbosity };
