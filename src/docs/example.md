#### Installation

```shell
npm install --save verbosity
```

#### Examples

Simply override the built in console object:

```javascript
const console = require('../../index.js').createConsole({
	outStream: process.stdout,
	errorStream: process.stderr,
	verbosity: 5
})
```

This will direct all console output to stderr, but silence 'info' and 'debug' messages.

```javascript
const console = require('../../index.js').createConsole({
	outStream: process.stderr,
	verbosity: 3
})

console.log('Picked brown jacket...') // Printed
console.debug('Purple tie chosen...') // Not printed
console.warn("That tie doesn't go with that jacket.") // Printed
```

Or go mad with making up any number of custom console writers.

```javascript
const myUberConsole = require('../../index.js').createConsole({
	outStream: myFancyWriteableStream,
	verbosity: 5
})

myUberConsole.panic('Core Flux Capacitor Meltdown!')
```

