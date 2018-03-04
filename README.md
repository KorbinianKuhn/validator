# Validator

[![Travis](https://img.shields.io/travis/KorbinianKuhn/validator.svg?style=flat-square)](https://travis-ci.org/KorbinianKuhn/validator/builds)
[![Coverage](http://img.shields.io/coveralls/KorbinianKuhn/validator.svg?style=flat-square&branch=master)](https://coveralls.io/r/KorbinianKuhn/validator)
[![Known Vulnerabilities](https://snyk.io/test/github/KorbinianKuhn/validator/badge.svg?style=flat-square)](https://snyk.io/test/github/KorbinianKuhn/validator)
[![Dependencies](https://img.shields.io/david/KorbinianKuhn/validator.svg?style=flat-square)](https://david-dm.org/KorbinianKuhn/validator)
[![Dev Dependencies](https://img.shields.io/david/dev/KorbinianKuhn/validator.svg?style=flat-square)](https://david-dm.org/KorbinianKuhn/validator)
[![npm](https://img.shields.io/npm/dt/@korbiniankuhn/validator.svg?style=flat-square)](https://www.npmjs.com/package/@korbiniankuhn/validator)
[![npm-version](https://img.shields.io/npm/v/@korbiniankuhn/validator.svg?style=flat-square)](https://www.npmjs.com/package/@korbiniankuhn/validator)
[![Greenkeeper badge](https://badges.greenkeeper.io/KorbinianKuhn/validator.svg?style-flat)](https://greenkeeper.io/)
![license](https://img.shields.io/github/license/KorbinianKuhn/validator.svg?style=flat-square)

Validate input values with object schemas.

Features

- completely async validation
- highly customizable
- automatic documentation generation (e.g. RAML)
- reusable custom types
- short syntax through stacked function calls
- parse input values to target type
- special expressjs and Angular support

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

``` javascript
const { Validator } = require('@korbiniankuhn/validator');
const validator = Validator();
```

Create a new Schema:

``` javascript
const schema = validator.Object({
  name: validator.String()
});

await schema.validate({name: 'Jane Doe'});
// returns the given object
```

Extend the validator with custom schemas and types to reuse them later:

``` javascript
// Create a reusable regular expression
const myRegex = validator.Regex(\[A-Z]\);
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

The MIT License

Copyright (c) 2018 Korbinian Kuhn

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
