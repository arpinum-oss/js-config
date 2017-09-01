# @arpinum/config [![Build Status](https://travis-ci.org/arpinum-js-engine/js-config.svg?branch=master)](https://travis-ci.org/arpinum-js-engine/js-config)

> One man's constant is another man's variable.
> <cite>(Alan Perlis)</cite>

*@arpinum/config* is a simple module to read configuration from env variables.

It helps you implement a [12-factor configuration].

## Installation

    npm install @arpinum/config --save

## Usage

Given those env variables:

```bash
export DATABASE_URL=mongodb://localhost:27017/database
export LOG_LEVEL=info
```

In your app, require the module then read the configuration:

```javascript
const config = require('@arpinum/config');

let configuration = config({
  databaseUrl: {
    env: 'DATABASE_URL'
  },
  logLevel: {
     env: 'LOG_LEVEL'
   }
});

console.log(configuration);
```

The output is:

```bash
{
  databaseUrl: 'mongodb://localhost:27017/database',
  logLevel: 'info'
}
```

## Nested configuration

Configuration can be nested:


```javascript
let configuration = config({
  database: {
    url: {
      env: 'DATABASE_URL'
    },
    user: {
      env: 'DATABASE_USER'
    }
  }
});


console.log(configuration);
```

The output is:

```
{
  database: {
    url: '...',
    user: '...'
  }
}
```

## Default value

A default value can be used if the variable is missing:

```javascript
let configuration = config({
  logLevel: {
     env: 'LOG_LEVEL',
     default: 'info'
  }
});
```

## Required value

If a property is marked as required, the module will throw an error if the corresponding variable is missing.

Example:

```javascript
let configuration = config({
  logLevel: {
     env: 'LOG_LEVEL',
     required: true
  }
});
```

## Type conversion

A property can be cast to a given type, provided representation is compatible.

Example:

```javascript
let configuration = config({
  retryCount: {
     env: 'RETRY_COUNT',
     type: 'integer'
  }
});
```

Available types:

* string (default),
* integer,
* boolean,
* float

Boolean representations (case insensitive):

* true: true, yes
* false: false, no

## Custom type conversion

A property can be converted using a custom conversion function.

Example:

```javascript
let configuration = config({
  timeoutInMilliseconds: {
     env: 'TIMEOUT_IN_SECONDS',
     convert: v => v * 1000
  }
});
```

## Inspiration

My main source of inspiration is [12factor-config], a simple module made by [chilts].

I thank him for his work, his module helped me a while.

## License

[MIT](LICENSE)


[12-factor configuration]: https://12factor.net/config
[12factor-config]: https://github.com/chilts/12factor-config
[chilts]: https://github.com/chilts
