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

console.verbosity(3)

console.debug('...this isn’t printed now.')

console.canWrite(5) && console.dir({print: 'this won’t.'})

console.verbosity(5)

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

