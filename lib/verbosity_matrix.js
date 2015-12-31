'use strict';

/*
	verbosity (v0.1.2)
	Message Logging Priority Matrix
 */
var VerbosityMatrix, in_color, util,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

util = require('util');

in_color = !(/no-color/.test(process.argv.join('')));

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
    var error, out, verbosity;
    out = options_.out, error = options_.error, verbosity = options_.verbosity;
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
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.threshold > 4) {
      this.outStream.write(util.format.apply(util, chunks) + "\n");
    }
    return false;
  };

  VerbosityMatrix.prototype.info = function() {
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.threshold > 3) {
      this.outStream.write(util.format.apply(util, chunks) + "\n");
    }
    return false;
  };

  VerbosityMatrix.prototype.log = function() {
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.threshold > 2) {
      this.outStream.write(util.format.apply(util, chunks) + "\n");
    }
    return false;
  };

  VerbosityMatrix.prototype.warn = function() {
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.threshold > 1) {
      this.errorStream.write("\x1b[33m" + util.format.apply(util, chunks) + "\x1b[0m\n");
    }
    return false;
  };

  VerbosityMatrix.prototype.error = function() {
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.threshold > 0) {
      this.errorStream.write("\x1b[31mERROR: " + util.format.apply(util, chunks) + "\x1b[0m\n");
    }
    return false;
  };

  VerbosityMatrix.prototype.critical = function() {
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.threshold > 0) {
      this.errorStream.write("\x1b[1m\x1b[31mCRITICAL: " + util.format.apply(util, chunks) + "\x1b[0m\n");
    }
    return false;
  };

  VerbosityMatrix.prototype.panic = function() {
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return this.critical.apply(this, chunks);
  };

  VerbosityMatrix.prototype.emergency = function() {
    var chunks;
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return this.critical.apply(this, chunks);
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
    formatted = util.inspect(obj, {
      depth: descend,
      colors: in_color
    });
    return this.outStream.write(util.format("Content: %s\n", formatted.slice(0, -1).replace(/^{/, 'Object\n ').replace(/^\[/, 'Array\n ').replace(/^(\w+) {/, '$1').replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
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
    formatted = util.inspect(parsed, {
      colors: in_color
    });
    return this.outStream.write(util.format("Options (yargs):\n  %s\n", formatted.slice(2, -1).replace(/:/g, ' ▸').replace(/,\n/g, '\n')));
  };

  return VerbosityMatrix;

})(console.Console);

module.exports = VerbosityMatrix;
