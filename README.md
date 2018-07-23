# Validator

[![Travis](https://img.shields.io/travis/KorbinianKuhn/validator.svg?style=flat-square)](https://travis-ci.org/KorbinianKuhn/validator/builds)
[![Coverage](http://img.shields.io/coveralls/KorbinianKuhn/validator.svg?style=flat-square&branch=master)](https://coveralls.io/r/KorbinianKuhn/validator)
[![Known Vulnerabilities](https://snyk.io/test/github/KorbinianKuhn/validator/badge.svg?style=flat-square)](https://snyk.io/test/github/KorbinianKuhn/validator)
[![Dependencies](https://img.shields.io/david/KorbinianKuhn/validator.svg?style=flat-square)](https://david-dm.org/KorbinianKuhn/validator)
[![Dev Dependencies](https://img.shields.io/david/dev/KorbinianKuhn/validator.svg?style=flat-square)](https://david-dm.org/KorbinianKuhn/validator)
[![npm](https://img.shields.io/npm/dt/@korbiniankuhn/validator.svg?style=flat-square)](https://www.npmjs.com/package/@korbiniankuhn/validator)
[![npm-version](https://img.shields.io/npm/v/@korbiniankuhn/validator.svg?style=flat-square)](https://www.npmjs.com/package/@korbiniankuhn/validator)
[![Greenkeeper badge](https://badges.greenkeeper.io/KorbinianKuhn/validator.svg?style=flat-square)](https://greenkeeper.io/)
![license](https://img.shields.io/github/license/KorbinianKuhn/validator.svg?style=flat-square)

Validate input values with object schemas.

Features

- completely sync or async validation
- highly customizable
- automatic documentation generation (e.g. RAML)
- reusable custom types
- short syntax through function chaining
- parse input values to target type
- special support for expressjs, angular, mongoose
- no dependencies

## API

See the detailed [API Reference](doc/api.md).

Additional information for:

- [expressjs](doc/express.md)
- [angular](doc/angular.md)
- [mongoose](doc/mongoose.md)

## Installation

For installation use the [Node Package Manager](https://github.com/npm/npm):

```
$ npm install --save @korbiniankuhn/validator
```

or clone the repository:

```
$ git clone https://github.com/KorbinianKuhn/validator
```

## Getting started

Initialize a new Validator:

```javascript
const { Validator } = require('@korbiniankuhn/validator');
const validator = Validator();
```

Create a new Schema:

```javascript
const schema = validator.Object({
  name: validator.String()
});

schema.validate({ name: 'Jane Doe' }).then(object => {
  // returns the given object
});

schema.validateSync({ name: 'Jane Doe' });
// returns given object
```

Extend the validator with custom schemas and types to reuse them later:

```javascript
// Create a reusable regular expression
const myRegex = validator.String().regex(/[A-Z]/);
validator.addType('myRegex', myRegex);

await validator.Custom('myRegex').validate(value)

// Create a reusable address schema
const address = validator.Object({
  street: validator.String(),
  postal: validator.Integer(),
  city: validator.String()
})
validator.addType('address', address);

await validator.Custom('address').validate(value)
```

## Testing

First you have to install all dependencies:

```
$ npm install
```

To execute all unit tests once, use:

```
$ npm test
```

To get information about the test coverage, use:

```
$ npm run coverage
```

## Contribution

Get involved and push in your ideas.

Do not forget to add corresponding tests to keep up 100% test coverage.

## License

[The MIT License](LICENSE)
