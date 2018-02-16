# Validator

[![Travis](https://img.shields.io/travis/KorbinianKuhn/validator.svg?style=flat-square)](https://travis-ci.org/KorbinianKuhn/validator/builds)
[![Coverage](http://img.shields.io/coveralls/KorbinianKuhn/validator.svg?style=flat-square&branch=master)](https://coveralls.io/r/KorbinianKuhn/validator)
[![Known Vulnerabilities](https://snyk.io/test/github/KorbinianKuhn/validator/badge.svg?style=flat-square)](https://snyk.io/test/github/KorbinianKuhn/validator)
[![Dependencies](https://img.shields.io/david/KorbinianKuhn/validator.svg?style=flat-square)](https://david-dm.org/KorbinianKuhn/validator)
[![Dev Dependencies](https://img.shields.io/david/dev/KorbinianKuhn/validator.svg?style=flat-square)](https://david-dm.org/KorbinianKuhn/validator)
[![npm](https://img.shields.io/npm/dt/@korbiniankuhn/validator.svg?style=flat-square)](https://www.npmjs.com/package/@korbiniankuhn/validator)
[![npm-version](https://img.shields.io/npm/v/@korbiniankuhn/validator.svg?style=flat-square)](https://www.npmjs.com/package/@korbiniankuhn/validator)
![license](https://img.shields.io/github/license/KorbinianKuhn/validator.svg?style=flat-square)

This package validates variable input parameters. The validation parameters are described by objects as schemas. The goal of this package is easy readability and flexible customization. The validator provides detailed information about invalid input values. All validation will be handled asynchronous and can be extended with custom async functions.

Features
- completely async validation
- highly customizable



It can also parse input string values to target types (e.g. boolean, integer, number, array or object).
This package validates variable input parameters for express REST APIs.  that can be automatically sent as an error response to the user. 



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

``` javascript
const eiv = require('@korbiniankuhn/validator');
const validator = eiv.Validator();
```

Create a new Schema:

``` javascript
const schema = validator.Object({
  name: validator.String()
});

await schema.validate({name: 'Jane Doe'});
// returns the given object
```

The different Schema types:

``` javascript
// Simple types
validator.Boolean();
validator.Boolean();
validator.Date();
validator.Integer();
validator.Number();
validator.Regex(\[A-Z]\);
validator.String();

// Whitelisted inputs
validator.Enum([1,2,3]);

// Arrays
validator.Array(validator.String());

// Objects / stacked types
validator.Object({
  street: validator.String(),
  postal: validator.Integer()
});

// Custom functions
validator.Function((value, options) => { return true});

// Request to validate express req
validator.Request(options);
```

Extend the validator with custom schemas and types to reuse them later:

``` javascript
// Create a reusable regular expression
const myRegex = validator.Regex(\[A-Z]\);
validator.addType('myRegex', myRegex);
validator.Custom('myRegex');

// Create a reusable address schema
const address = validator.Object({
  street: validator.String(),
  postal: validator.Integer(),
  city: validator.String()
})
validator.addType('address', address);
validator.Custom('address');
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

The MIT License

Copyright (c) 2017 Korbinian Kuhn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.