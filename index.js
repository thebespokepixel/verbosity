'use strict'
/*
	verbosity
	Verbosity Controlling Console Writer/Emitter

	Copyright (c) 2016 Mark Griffiths

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

var _package = require('./package.json')

var _package2 = _interopRequireDefault(_package)

var _verbosity_matrix = require('./lib/verbosity_matrix')

var _verbosity_matrix2 = _interopRequireDefault(_verbosity_matrix)

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : {
		default: obj
	}
}

exports.console = function () {
	let options_ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0]
	return new _verbosity_matrix2.default(options_)
}

exports.getName = () => _package2.default.name

exports.getVersion = level_ => level_ === undefined || level_ < 2 ? `${ _package2.default.version }` : `${ _package2.default.name } v${ _package2.default.version }`

