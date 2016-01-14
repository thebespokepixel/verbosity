'use strict';

/*
	verbosity
	Message Logging Priority Matrix
 */
var VerbosityMatrix, chalk, format, in_color, inspect, ref,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

format = require('util').format;

inspect = require('util').inspect;

in_color = (ref = require('term-ng').color.level) != null ? ref : false;

chalk = require('chalk');

VerbosityMatrix = (function(superClass) {
  extend(VerbosityMatrix, superClass);

  function VerbosityMatrix(options_) {
    this.critical = bind(this.critical, this);
    this.error = bind(this.error, this);
    this.warn = bind(this.warn, this);
    this.log = bind(this.log, this);
    this.info = bind(this.info, this);
    this.debug = bind(this.debug, this);
    this.canWrite = bind(this.canWrite, this);
    this.verbosity = bind(this.verbosity, this);
    var dateformat, error, out, timestamp, verbosity;
    out = options_.out, error = options_.error, verbosity = options_.verbosity, timestamp = options_.timestamp;
    if (out == null) {
      out = process.stdout;
    }
    if (error == null) {
      error = out;
    }
    if (!out.writable) {
      throw new Error('Provided output stream must be writable');
    }
    if (!error.writable) {
      throw new Error('Provided error stream must be writable');
    }
    VerbosityMatrix.__super__.constructor.call(this, out, error);
    if (timestamp != null) {
      dateformat = require('dateformat');
      this.timestamp = function() {
        return "[" + (chalk.dim(dateformat(timestamp))) + "] ";
      };
    } else {
      this.timestamp = function() {
        return '';
      };
    }
    this.threshold = verbosity != null ? verbosity : 3;
    this.outStream = out;
    this.errorStream = error;
  }

  VerbosityMatrix.prototype.verbosity = function(level_) {
    if ((0 < level_ && level_ < 6)) {
      this.threshold = level_;
    }
    return this.threshold;
  };

  VerbosityMatrix.prototype.canWrite = function(level_) {
    return this.threshold >= level_;
  };

  VerbosityMatrix.prototype.debug = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (this.threshold > 4) {
      if (typeof msg === 'string' && (args != null)) {
        msg = format.apply(null, [msg].concat(slice.call(args)));
      }
      this.outStream.write("" + (this.timestamp()) + (chalk.dim(msg)) + "\n");
    }
  };

  VerbosityMatrix.prototype.info = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (this.threshold > 3) {
      if (typeof msg === 'string' && (args != null)) {
        msg = format.apply(null, [msg].concat(slice.call(args)));
      }
      this.outStream.write("" + (this.timestamp()) + msg + "\n");
    }
  };

  VerbosityMatrix.prototype.log = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (this.threshold > 2) {
      if (typeof msg === 'string' && (args != null)) {
        msg = format.apply(null, [msg].concat(slice.call(args)));
      }
      this.outStream.write("" + (this.timestamp()) + msg + "\n");
    }
  };

  VerbosityMatrix.prototype.warn = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (this.threshold > 1) {
      if (typeof msg === 'string' && (args != null)) {
        msg = format.apply(null, [msg].concat(slice.call(args)));
      }
      this.errorStream.write("" + (this.timestamp()) + (chalk.yellow(msg)) + "\n");
    }
  };

  VerbosityMatrix.prototype.error = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (this.threshold > 0) {
      msg = format.apply(null, ["ERROR:", msg].concat(slice.call(args)));
      this.errorStream.write("" + (this.timestamp()) + (chalk.red(msg)) + "\n");
    }
  };

  VerbosityMatrix.prototype.critical = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (this.threshold > 0) {
      msg = format.apply(null, ["CRITICAL:", msg].concat(slice.call(args)));
      this.errorStream.write("" + (this.timestamp()) + (chalk.bold.red(msg)) + "\n");
    }
  };

  VerbosityMatrix.prototype.panic = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.critical.apply(this, [msg].concat(slice.call(args)));
  };

  VerbosityMatrix.prototype.emergency = function() {
    var args, msg;
    msg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return this.critical.apply(this, [msg].concat(slice.call(args)));
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
    return obj;
  };

  VerbosityMatrix.prototype.trace = function(obj, title) {
    if (title == null) {
      title = "";
    }
    this.dir(obj, {
      depth: 5
    });
    this.error("Line: " + obj.line, "Column: " + obj.column, title);
    VerbosityMatrix.__super__.trace.call(this, obj);
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
    return this.outStream.write(format("Content: %s\n", formatted.slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
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
    return this.outStream.write(format("Options (yargs):\n  %s\n", formatted.slice(2, -1).replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
  };

  return VerbosityMatrix;

})(console.Console);

module.exports = VerbosityMatrix;
