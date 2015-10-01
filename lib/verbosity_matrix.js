'use strict'

/*
	verbosity (v0.0.7)
	Message Logging Priority Matrix
 */
var VerbosityMatrix, util,
  bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
  extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor () { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice

util = require('util')

VerbosityMatrix = (function (superClass) {
  extend(VerbosityMatrix, superClass)

  function VerbosityMatrix (outStream, errorStream, level) {
    this.outStream = outStream
    this.errorStream = errorStream
    this.level = level
    this.error = bind(this.error, this)
    this.warn = bind(this.warn, this)
    this.info = bind(this.info, this)
    this.log = bind(this.log, this)
    this.debug = bind(this.debug, this)
    this.verbosity = bind(this.verbosity, this)
    if (this.errorStream == null) {
      this.errorStream = this.outStream
    }
    if (!(this.outStream.writable && this.errorStream.writable)) {
      throw new Error('Provided outputs must be writable streams')
    }
    VerbosityMatrix.__super__.constructor.call(this, this.outStream, this.errorStream)
  }

  VerbosityMatrix.prototype.verbosity = function (newLevel) {
    if ((0 < newLevel && newLevel < 6)) {
      this.level = newLevel
    }
    return this.level
  }

  VerbosityMatrix.prototype.debug = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 4) {
      return this.outStream.write(util.format.apply(util, chunks))
    } else {
      return false
    }
  }

  VerbosityMatrix.prototype.log = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 3) {
      return this.outStream.write(util.format.apply(util, chunks))
    } else {
      return false
    }
  }

  VerbosityMatrix.prototype.info = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 2) {
      return this.outStream.write(util.format.apply(util, chunks))
    } else {
      return false
    }
  }

  VerbosityMatrix.prototype.warn = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 1) {
      return this.errorStream.write(util.format.apply(util, chunks))
    } else {
      return false
    }
  }

  VerbosityMatrix.prototype.error = function () {
    var chunks
    chunks = 1 <= arguments.length ? slice.call(arguments, 0) : []
    if (this.level > 0) {
      return this.errorStream.write(util.format.apply(util, chunks))
    } else {
      return false
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

})(console.Console)

module.exports = VerbosityMatrix
