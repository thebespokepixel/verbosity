'use strict'

/*
	verbosity (v0.0.5)
	Message Logging Priority Matrix
 */
var Console, VerbosityMatrix,
  slice = [].slice,
  bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
  extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor () { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty

Console = require('console').Console

Console.prototype.debug = function () {
  var chunks
  chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
  return this.log.apply(this, chunks)
}

VerbosityMatrix = (function (superClass) {
  extend(VerbosityMatrix, superClass)

  function VerbosityMatrix (outStream, errorStream, level) {
    this.outStream = outStream != null ? outStream : process.stderr
    this.errorStream = errorStream != null ? errorStream : null
    this.level = level != null ? level : 4
    this.error = bind(this.error, this)
    this.warn = bind(this.warn, this)
    this.info = bind(this.info, this)
    this.log = bind(this.log, this)
    this.debug = bind(this.debug, this)
    VerbosityMatrix.__super__.constructor.call(this, this.outStream, this.errorStream)
  }

  VerbosityMatrix.prototype.verbosity = function (newLevel) {
    if ((0 < newLevel && newLevel < 6)) {
      return this.level = newLevel
    }
  }

  VerbosityMatrix.prototype.debug = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 4) {
      VerbosityMatrix.__super__.debug.apply(this, chunks)
      return chunks.join(' ')
    } else {
      return ''
    }
  }

  VerbosityMatrix.prototype.log = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 3) {
      VerbosityMatrix.__super__.log.apply(this, chunks)
      return chunks.join(' ')
    } else {
      return ''
    }
  }

  VerbosityMatrix.prototype.info = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 2) {
      VerbosityMatrix.__super__.info.apply(this, chunks)
      return chunks.join(' ')
    } else {
      return ''
    }
  }

  VerbosityMatrix.prototype.warn = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 1) {
      VerbosityMatrix.__super__.warn.apply(this, chunks)
      return chunks.join(' ')
    } else {
      return ''
    }
  }

  VerbosityMatrix.prototype.error = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 0) {
      VerbosityMatrix.__super__.error.apply(this, chunks)
      return chunks.join(' ')
    } else {
    }
  }

  VerbosityMatrix.prototype.dir = function (obj) {
    VerbosityMatrix.__super__.dir.call(this, obj, {
      showHidden: false,
      depth: 5,
      colors: true
    })
    return obj
  }

  return VerbosityMatrix

})(Console)

module.exports = VerbosityMatrix
