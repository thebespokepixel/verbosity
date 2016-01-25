'use strict';

/*
	verbosity
	Message Logging Priority Matrix
 */
var VerbosityMatrix, format, in_color, inspect, ref, sgr,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

format = require('util').format;

inspect = require('util').inspect;

in_color = (ref = require('term-ng').color.level) != null ? ref : false;

sgr = require('chalk');

VerbosityMatrix = (function(superClass) {
  extend(VerbosityMatrix, superClass);

  function VerbosityMatrix(options_) {
    var dateformat, errorStream, namespace, outStream, pfix, prefix, sparkles, timestamp, tstamp, verbosity;
    outStream = options_.outStream, errorStream = options_.errorStream, verbosity = options_.verbosity, timestamp = options_.timestamp, namespace = options_.namespace, prefix = options_.prefix;
    if (outStream == null) {
      outStream = process.stdout;
    }
    if (errorStream == null) {
      errorStream = outStream;
    }
    if (!outStream.writable) {
      throw new Error('Provided output stream must be writable');
    }
    if (!errorStream.writable) {
      throw new Error('Provided error stream must be writable');
    }
    VerbosityMatrix.__super__.constructor.call(this, outStream, errorStream);
    if (this.emits = namespace != null) {
      sparkles = require('sparkles');
      this.emitter = sparkles(namespace);
    }
    tstamp = timestamp != null ? (dateformat = require('dateformat'), function() {
      return "[" + (sgr.dim(dateformat(timestamp))) + "] ";
    }) : function() {
      return '';
    };
    pfix = prefix != null ? function() {
      return "[" + prefix + "] ";
    } : function() {
      return '';
    };
    this.threshold = verbosity != null ? verbosity : 3;
    this.outStream = outStream;
    this.errorStream = errorStream;
    this._levels = {
      debug: {
        level: 5,
        stream: outStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + (sgr.dim(msg));
        }
      },
      info: {
        level: 4,
        stream: outStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + msg;
        }
      },
      log: {
        level: 3,
        stream: outStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + msg;
        }
      },
      warn: {
        level: 2,
        stream: errorStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + (sgr.yellow(msg));
        }
      },
      error: {
        level: 1,
        stream: errorStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + (sgr.red('ERROR: ' + msg));
        }
      },
      critical: {
        level: 0,
        stream: errorStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + (sgr.bold.red('CRITICAL: ' + msg));
        }
      },
      panic: {
        level: 0,
        stream: errorStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + (sgr.bold.red('PANIC: ' + msg));
        }
      },
      emergency: {
        level: 0,
        stream: errorStream,
        format: function(msg) {
          return "" + (tstamp()) + (pfix()) + (sgr.bold.red('EMERGENCY: ' + msg));
        }
      }
    };
  }

  VerbosityMatrix.prototype._router = function() {
    var args, level_, msg;
    level_ = arguments[0], msg = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    if (typeof msg === 'string' && (args != null)) {
      msg = format.apply(null, [msg].concat(slice.call(args)));
    }
    if (this.emits) {
      this.emitter.emit(level_, msg);
    }
    if (this.threshold >= this._levels[level_].level) {
      this._levels[level_].stream.write(this._levels[level_].format(msg) + '\n');
    }
  };

  VerbosityMatrix.prototype.verbosity = function(level_) {
    if (typeof level_ === 'string') {
      level_ = this.levels[level_];
    }
    if (level_ < 6) {
      this.threshold = level_;
    }
    return this.threshold;
  };

  VerbosityMatrix.prototype.canWrite = function(level_) {
    if (typeof level_ === 'string') {
      level_ = this.levels[level_];
    }
    return this.threshold >= level_;
  };

  VerbosityMatrix.prototype.debug = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['debug', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.info = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['info', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.log = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['log', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.warn = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['warn', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.error = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['error', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.critical = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['critical', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.panic = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['panic', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.emergency = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this._router.apply(this, ['emergency', msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.dir = function(obj, options) {
    if (options == null) {
      options = {};
    }
    if (options.depth == null) {
      options.depth = 0;
    }
    if (options.color == null) {
      options.color = in_color;
    }
    VerbosityMatrix.__super__.dir.call(this, obj, {
      depth: options.depth,
      colors: options.color
    });
  };

  VerbosityMatrix.prototype.pretty = function(obj, descend) {
    var formatted;
    if (descend == null) {
      descend = 0;
    }
    formatted = inspect(obj, {
      depth: descend,
      colors: in_color
    });
    this.outStream.write(format("Content: %s\n", formatted.slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
  };

  VerbosityMatrix.prototype.yargs = function(obj) {
    var formatted, key, parsed, val;
    parsed = {};
    for (key in obj) {
      val = obj[key];
      switch (key) {
        case '_':
          if (val.length > 0) {
            parsed["arguments"] = val.join(' ');
          }
          break;
        case '$0':
          parsed.self = val;
          break;
        default:
          if (key.length > 1) {
            parsed[key] = val;
          }
      }
    }
    formatted = inspect(parsed, {
      colors: in_color
    });
    this.outStream.write(format("Options (yargs):\n  %s\n", formatted.slice(2, -1).replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
  };

  return VerbosityMatrix;

})(console.Console);

module.exports = VerbosityMatrix;
