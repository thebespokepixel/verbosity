# verbosity

> An augmented drop-in console replacement that supports logging levels.

##### Publishing Status

[![npm](https://img.shields.io/npm/v/verbosity?logo=npm)](https://www.npmjs.com/package/verbosity "npm") [![David](https://david-dm.org/thebespokepixel/verbosity/master/status.svg)](https://david-dm.org/thebespokepixel/verbosity/master "David")  
 [![Travis](https://img.shields.io/travis/com/thebespokepixel/verbosity/master?logo=travis)](https://travis-ci.com/thebespokepixel/verbosity "Travis") [![Rollup](https://img.shields.io/badge/es6-module%3Amjs_%E2%9C%94-64CA39?&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZmlsbD0iI0ZGMzMzMyIgZD0iTTEwLjkwNDI4MjQsMy4wMDkxMDY4MyBDMTEuMjM4NzA1NSwzLjU4MjgzNzEzIDExLjQyODU3MTQsNC4yNDQ4MzM2MyAxMS40Mjg1NzE0LDQuOTUwOTYzMjIgQzExLjQyODU3MTQsNi40MTc4NjM0IDEwLjYwODY5NTcsNy42OTU2MjE3MiA5LjM5MTgyNzM5LDguMzc2NTMyNCBDOS4zMDU1MjQ2OCw4LjQyNDg2ODY1IDkuMjczMTYxMTYsOC41MzIwNDkwNCA5LjMxODQ3MDA5LDguNjE4MjEzNjYgTDExLjQyODU3MTQsMTMgTDUuMjU4NjgyODEsMTMgTDIuMzM5Nzc3MjMsMTMgQzIuMTUyMTIzNDUsMTMgMiwxMi44NDgyNzU3IDIsMTIuNjUzODA0OCBMMiwxLjM0NjE5NTIyIEMyLDEuMTU0OTk2ODggMi4xNDgzMTU0MywxIDIuMzM5Nzc3MjMsMSBMNy42NjAyMjI3NywxIEM3LjcwMTU0MTQ5LDEgNy43NDExMzc2NCwxLjAwNzM1NTg4IDcuNzc3NzY2NTgsMS4wMjA5MDQyOSBDOS4wNjQ1MzgyOCwxLjE0NDU0MDA0IDEwLjE3MzM4ODQsMS44NTM4NTI5MSAxMC44MjIyOTQ5LDIuODcyNTA0MzggQzEwLjc5OTE5NTMsMi44NDQ4NDgwNiAxMC44NDQ0OTkxLDIuOTQ5MTc0NzYgMTAuOTA0MjgyNCwzLjAwOTEwNjgzIFoiLz4KICAgIDxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iLjMxIiBkPSJNOC44NTcxNDI4NiwzLjU3MTQyODU3IEw2LjcxNDI4NTcxLDYuNTcxNDI4NTcgTDkuMjg1NzE0MjksNS4yODU3MTQyOSBDOS4yODU3MTQyOSw1LjI4NTcxNDI5IDkuNzE0Mjg1NzEsNC44NTcxNDI4NiA5LjI4NTcxNDI5LDQuNDI4NTcxNDMgQzkuMjg1NzE0MjksNCA4Ljg1NzE0Mjg2LDMuNTcxNDI4NTcgOC44NTcxNDI4NiwzLjU3MTQyODU3IFoiLz4KICAgIDxwYXRoIGZpbGw9IiNGQkIwNDAiIGQ9Ik0yLjg0Njc0NjAzLDEyLjk5NTg0OTUgQzMuMjY0OTIwNjIsMTIuOTk1ODQ5NSAzLjE4NTkzMDM0LDEyLjk0NjM2NjkgMy4zMTYxMTYzOCwxMi44NzM5MDU0IEMzLjYxODE3NTg3LDEyLjcwNTc3OTMgNS42ODk0NDA5OSw4LjcxMjc4NDU5IDcuNzE3NTU0NzYsNi44MjEzNjYwMiBDOS43NDU2Njg1Miw0LjkyOTk0NzQ2IDEwLjAwNDU3NjcsNS41NjA0MjAzMiA4Ljg4NDc5ODk1LDMuNTAyOTc3MjMgQzguODg0Nzk4OTUsMy41MDI5NzcyMyA5Ljc0NzgyNjA5LDUuMTQyMjA2NjUgOS4wMTQyNTMwMiw1LjI2ODMwMTIzIEM4LjQzODE4MjQxLDUuMzY3MDc1MzEgNy4xMTk5MDg0Nyw0LjEyMjk0MjIxIDcuNjExODMzOTMsMy4wMDQ5MDM2OCBDOC4wOTA4MTM5OSwxLjkxNDE4NTY0IDEwLjAxOTY3OTYsMi4xMjAxNDAxMSAxMC45MDY0NCwzLjAwOTEwNjgzIEMxMC44NzgzOTE2LDIuOTYyODcyMTUgMTAuODUwMzQzMiwyLjkxNjYzNzQ4IDEwLjgyMjI5NDksMi44NzI1MDQzOCBDMTAuMzA0NDc4NiwyLjI1MjUzOTQgOS41MDQwMjA5MiwxLjkwMzY3Nzc2IDguNzEwMDM1OTYsMS45MDM2Nzc3NiBDNy4xOTk3Mzg0OCwxLjkwMzY3Nzc2IDYuODIwMDA2NTQsMi40MjY5NzAyMyAzLjkyMDIzNTM3LDcuNjE5OTY0OTcgQzIuMzg3Nzk5MzQsMTAuMzY1NDA2NyAyLjAxMDgzMTkzLDExLjU3MzUwNzkgMi4wMDYyOTA2OSwxMi4xNjk4MTgyIEMyLDEyLjk5NTg0OTUgMi4wMDYyOTA2OSwxMi45OTU4NDk1IDIuODQ2NzQ2MDMsMTIuOTk1ODQ5NSBaIi8%2BCiAgPC9nPgo8L3N2Zz4K)](https://github.com/rollup/rollup/wiki/pkg.module "Rollup")   

##### Development Status

[![Greenkeeper](https://badges.greenkeeper.io/thebespokepixel/verbosity.svg)](https://greenkeeper.io/ "Greenkeeper") [![Travis](https://img.shields.io/travis/com/thebespokepixel/verbosity/develop?logo=travis)](https://travis-ci.com/thebespokepixel/verbosity "Travis")  
 [![David](https://david-dm.org/thebespokepixel/verbosity/develop/status.svg)](https://david-dm.org/thebespokepixel/verbosity/develop "David") [![David-developer](https://david-dm.org/thebespokepixel/verbosity/develop/dev-status.svg)](https://david-dm.org/thebespokepixel/verbosity/develop?type=dev "David-developer")  
 [![Snyk](https://snyk.io/test/github/thebespokepixel/verbosity/badge.svg)](https://snyk.io/test/github/thebespokepixel/verbosity "Snyk") [![Code-climate](https://api.codeclimate.com/v1/badges/374a4343fca92868720c/maintainability)](https://codeclimate.com/github/thebespokepixel/verbosity/maintainability "Code-climate") [![Coverage](https://api.codeclimate.com/v1/badges/374a4343fca92868720c/test_coverage)](https://codeclimate.com/github/thebespokepixel/verbosity/test_coverage "Coverage")   

##### Documentation/Help

[![Inch](https://inch-ci.org/github/thebespokepixel/verbosity.svg?branch=master&style=shields)](https://inch-ci.org/github/thebespokepixel/verbosity "Inch") [![Twitter](https://img.shields.io/twitter/follow/thebespokepixel?style=social)](https://twitter.com/thebespokepixel "Twitter")   


## Usage

#### About

I wanted to be able to have chattier daemons running in development, and more succinct logging in production but wanted to keep the simplicity of using `console.log()` etc.

Normally I pass in a granular verboseness level via arguments to control the verbosity level for the running process. 

#### Installation

```shell
npm install --save verbosity
```

#### Examples

Simply override the built in console object:

```javascript
import {createConsole} from 'verbosity'

const console = createConsole({
  outStream: process.stdout,
  errorStream: process.stderr,
  verbosity: 5
})

console.log('Works like normal...')
console.debug('...but now controllable.')

console.verbosity(3) // Use numbered levels 5 (debug) to 1 (error)

console.debug('...this isn’t printed now.')

console.canWrite(5) && console.dir({print: 'this won’t.'})

console.verbosity('debug') // Use named levels [debug, info, log, warning, error]

console.canWrite(5) && console.dir({print: 'this will now.'})
```

This will direct all console output to stderr, but silence 'info' and 'debug' messages.

```javascript
import {createConsole} from 'verbosity'

const console = createConsole({
  outStream: process.stderr,
  verbosity: 3
})

console.log('Picked brown jacket...') // Printed
console.debug('Purple tie chosen...') // Not printed
console.warn("That tie doesn't go with that jacket.") // Printed
```

Or go mad with making up any number of custom console writers.

```javascript
import {createConsole} from 'verbosity'

const myUberConsole = createConsole({
  outStream: myFancyWriteableStream,
  verbosity: 5
})

myUberConsole.panic('Core Flux Capacitor Meltdown!')
```


## Documentation

Full documentation can be found at [https://thebespokepixel.github.io/verbosity/][1]

[1]: https://thebespokepixel.github.io/verbosity/
