# Express input validator [![Travis](https://img.shields.io/travis/KorbinianKuhn/express-input-validator.svg)](https://travis-ci.org/KorbinianKuhn/express-input-validator/builds)  [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

This package validates variable input parameters for express REST APIs. The validation parameters are described by objects as schemas. The goal of this package is easy readability and flexible customization. The validator provides detailed information about invalid input values that can be automatically sent as an error response to the user.

## Installation

For installation use the [Node Package Manager](https://github.com/npm/npm):

```
$ npm install --save @korbiniankuhn/express-input-validator
```

or clone the repository:

```
$ git clone https://github.com/KorbinianKuhn/express-input-validator
```

## Getting started

Initialize a new Validator:

``` javascript
const eiv = require('@korbiniankuhn/express-input-validator');
const Validator = new eiv.Validator();
```

Create a new Schema:

``` javascript
const schema = Validator.Object({
  name: Validator.String()
});

Validator.isValid(schema, {name: 'Jane Doe'});
// true
```

The different Schema types:

``` javascript
// Simple types
Validator.Boolean();
Validator.Integer();
Validator.Number();
Validator.Regex(\[A-Z]\);
Validator.String();

// Whitelisted inputs
Validator.Enum([1,2,3]);

// Arrays
Validator.Array(Validator.String());

// Objects / stacked types
Validator.Object({
  street: Validator.String(),
  postal: Validator.Integer()
});

// Custom functions
Validator.Function((value, options) => { return true});
```

Extend the validator with custom schemas and types to reuse them later:

``` javascript
// Create a reusable regular expression
const myRegex = Validator.Regex(\[A-Z]\);
Validator.addType('myRegex', myRegex);
Validator.Custom('myRegex');

// Create a reusable address schema
const address = Validator.Object({
  street: Validator.String(),
  postal: Validator.Integer(),
  city: Validator.String()
})
Validator.addType('address', address);
Validator.Custom('address');
```

## Validator

If a schema gets checked by a validator it will get the validators options.

- `requiredAsDefault (boolean)`: Sets all parameters of a schema as required if not specified otherwise. Default true.
- `throwValidationError (boolean)`: Throw an error if validation fails. Default true.
- `noEmptyStrings (boolean)`: Disallow empty strings. Default true.
- `noEmptyArrays (boolean)`: Disallow empty arrays. Default true.
- `noEmptyObjects (boolean)`: Disallow empty objects. Default true.

Every schema and type can get own options which will override the ones of its parent.

``` javascript
const Validator = eiv.Validator({noEmptyStrings: true});
const schema = Validator.Object({
  empty: Validator.String({noEmptyStrings: false}),
  notEmpty: Validator.String()
});

const data = {
  empty: '',
  notEmpty: 'hi'
}

Validator.isValid(schema, data);
// true
```

## Types

All types share these functions:

- `required(boolean)`: Is the parameter required.

``` javascript
Validator.Boolean().required(false);
```

### Array

- `minLength(integer)`: Minimum length of the array.
- `maxLength(integer)`: Maximum length of the array.
- `exactLength(integer)`: Exact length of the array.

```javascript
Validator.Array(Validator.String(), options);
Validator.Array(Validator.String(), options).minLength(5).maxLength(10);
Validator.Array(Validator.String(), options).exactLength(5);
```

### Boolean

```javascript
Validator.Boolean(options);
```

### Enum

```javascript
Validator.Enum([1,2,3], options);
```

### Integer

- `min(integer)`: Minimum value.
- `max(integer)`: Maximum value.

```javascript
Validator.Integer(options);
Validator.Integer(options).min(5).max(20);
```

### Number

- `min(number)`: Minimum number.
- `max(number)`: Maximum number.

```javascript
Validator.Number(options);
Validator.Number(options).min(0.0).max(5.0);
```

### Object

```javascript
Validator.Object({
  name: Validator.String()
}, options);
```

### Regex

- `minLength(integer)`: Minimum length of the regex.
- `maxLength(integer)`: Maximum length of the regex.
- `exactLength(integer)`: Exact length of the regex.

```javascript
Validator.Regex(/A-Z/, options);
Validator.Regex(/A-Z/, options).minLength(5).maxLength(20);
Validator.Regex(/A-Z/, options).exactLength(15);
```

### String

- `minLength(integer)`: Minimum length of the string.
- `maxLength(integer)`: Maximum length of the string.
- `exactLength(integer)`: Exact length of the string.

```javascript
Validator.String(options);
Validator.String(options).minLength(5).maxLength(20);
Validator.String(options).exactLength(15);
```

## Express middleware

By default the Validator throws an error if the validation fails. It's recommended to wrap every route with an [async middleware](https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016) that catches the error and next it to an error handler middleware. Before this error handling middleware, you can use the provided middleware of this package.

The error middleware responds with a status code 400 and a json if the nexted error is an ValidationError object. Otherwise it will next the error.

``` javascript
const eiv = require('@korbiniankuhn/express-input-validator');

app.use(eiv.middleware());

// Do not send detailed information about the validation errors.
app.use(eiv.middleware({
  sendDetails: false
}));
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