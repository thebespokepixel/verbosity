# verbosity  
>A augmented drop-in console replacement that supports logging levels. 
>
>![Project status][project-badge]
[![npm Status][npm-badge]][npm]
[![XO code style][xo-badge]][xo]
[![Chat on Gitter][gitter-badge]][gitter]  
[![Build Status][build-badge]][travis]
[![Dependency Status][david-badge]][david]
[![devDependency Status][david-dev-badge]][david-dev]

### Install

```sh
npm install verbosity --save
```

### Usage

Inside a single script, simply override the built in console object:

```js
// This will duplicate the behaviour of the built in console object.
	
console = require("verbosity").console({
  out: process.stdout
  error: process.stderr
  verbosity: 5
})

/* 
  This will direct all console output to stderr,
  but silence 'info' and 'debug' messages.
*/

console = require("verbosity").console({
  out: process.stderr
  verbosity: 3
})


// Or go mad with making up any number of custom console writers.

myUberConsole = require("verbosity").console({
  out: myFancyWriteableStream
  verbosity: 5
})
```

To override the console object globally, in your main script (as coffeescript):

```coffee
verbosity = require "verbosity"
global.vconsole = verbosity.console
  out: process.stderr

# You can then specify the override in each script's header.
console = global.vconsole

# Using the above pattern, you can also access verbosity helper methods.
verbosity.getVersion()
# Outputs 0.1.3-alpha.0
```

### API

The API inherits from Console, and all the argument parsing options are available.

#### (critical | panic | emergency) args... (level 1)

Write a Critical/Emergency/Panic error message in red. Best used just before aborting the process with a `process.exit(1)`

```js
console.panic('Core Flux Capacitor Meltdown!')
```

    $ CRITICAL: Core Flux Capacitor Meltdown!

#### error args... (level 1)

Write a normal error message in red.

```js
console.error('This statement is false does not overload my logic circuits. moron.')
```

    $ ERROR:This statement is false does not overload my logic circuits. moron.

#### warn args... (level 2)

Write a normal warning message in yellow.

```js
console.warn("That tie doesn't go with that jacket.")
```

    $ That tie doesn't go with that jacket.

#### log args... (level 3)

As console.log.

#### info args... (level 4)

As console.info.

#### debug args... (level 5)

Same and console.info, just a level lower.

#### dir object [options]

As console.dir, but defaults to colour and zero depth.

#### pretty object, depth

Pretty prints object, similar to OS X's plutil -p. Defaults to zero depth.

```js
console.pretty(console)

/* Yeilds:
Object: VerbosityMatrix
  critical ▸ [Function]
  error ▸ [Function ▸ bound ]
  warn ▸ [Function ▸ bound ]
  log ▸ [Function ▸ bound ]
  info ▸ [Function ▸ bound ]
  debug ▸ [Function]
  canWrite ▸ [Function]
  ...
*/
```

#### yargs object, depth

Helper function for pretty printing a summary of the current 'yargs' options.

Only prints 'long options', `._` as 'arguments' and `$0` as 'self'.

```js
console.yargs(yargs)

/* Yeilds:
Object (yargs):
  left ▸ 2
  right ▸ 2
  mode ▸ 'hard'
  encoding ▸ 'utf8'
  ...
  self ▸ '/usr/local/bin/truwrap'
*/
```

#### canWrite level

Returns true if a message of level would be printed.

```js
if (console.canWrite(5)) {
  // Do something only if we're current logging at a debug level.
}
```

#### verbosity level

Set the current verbosity. The level will only stick if it's within the correct bounds. i.e 1-5.

#### time

As console.time.

#### timeEnd

As console.timeEnd.

#### trace

As console.trace.

#### assert

As console.assert.

[project-badge]: http://img.shields.io/badge/status-beta-blue.svg?style=flat
[build-badge]: http://img.shields.io/travis/MarkGriffiths/verbosity.svg?branch=master&style=flat
[david-badge]: http://img.shields.io/david/MarkGriffiths/verbosity.svg?style=flat
[david-dev-badge]: http://img.shields.io/david/dev/MarkGriffiths/verbosity.svg?style=flat
[npm-badge]: https://img.shields.io/npm/v/verbosity.svg?style=flat
[xo-badge]: https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[gitter-badge]: https://badges.gitter.im/MarkGriffiths/help.svg

[travis]: https://travis-ci.org/MarkGriffiths/verbosity
[david]: https://david-dm.org/MarkGriffiths/verbosity
[david-dev]: https://david-dm.org/MarkGriffiths/verbosity#info=devDependencies
[npm]: https://www.npmjs.com/package/verbosity
[xo]: https://github.com/sindresorhus/xo
[gitter]: https://gitter.im/MarkGriffiths/help?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge

