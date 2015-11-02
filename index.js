'use strict';

/*
	verbosity (v0.0.22)
	Verbosity Controlling Console Writer

	Copyright (c) 2015 CryptoComposite

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use, copy,
	modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var _package, _verbosity;

_package = require("./package.json");

_verbosity = require("./lib/verbosity_matrix");

exports.console = function(options_) {
  if (options_ == null) {
    options_ = {};
  }
  return new _verbosity(options_);
};

exports.getName = function() {
  return _package.name;
};

exports.getVersion = function(level) {
  switch (level) {
    case 1:
      return String (_package).version;
    default:
      return _package.name + " v" + _package.version;
  }
};
