# Express input validator [![Travis](https://img.shields.io/travis/KorbinianKuhn/express-input-validator.svg)](https://travis-ci.org/KorbinianKuhn/express-input-validator/builds)  [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

This package validates variable input parameters for express REST APIs. The validation parameters are described by objects as schemas. The goal of this package is easy readability and flexible customization. The validator provides detailed information about invalid input values that can be automatically sent as an error response to the user. All validation will be handled asynchronous and can be extended with custom async functions.

It can also parse input string values to target types (e.g. boolean, integer, number, array or object).

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
const Validator = eiv.Validator();
```

Create a new Schema:

``` javascript
const schema = Validator.Object({
  name: Validator.String()
});

await Validator.validate(schema, {name: 'Jane Doe'});
// returns the given object
```

The different Schema types:

``` javascript
// Simple types
Validator.Boolean();
Validator.Date();
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

// Request to validate express req
Validator.Request(options);
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
- `parseToType (boolean)`: Parse input data to type (e.g. 'true' -> true, '1.2' -> 1.2). Default false.
- `noEmptyStrings (boolean)`: Disallow empty strings. Default true.
- `trimStrings (boolean)`: Remove whitespaces from string. Default true.
- `noEmptyArrays (boolean)`: Disallow empty arrays. Default true.
- `noEmptyObjects (boolean)`: Disallow empty objects. Default true.
- `noUndefinedKeys (boolean)`: Disallow keys that are not defined by the schema. Default true.
- `parseDates (boolean)`: Parse date string to Date objects. Default true.

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

await Validator.validate(schema, data);
// returns data
```

## Types

All types share these functions:

- `required(boolean)`: Is the parameter required.
- `defaultValue(value)`: Default value if input is undefined/null. Overwrites `required` and `empty` settings.

``` javascript
Validator.Boolean().required(false);
Validator.Boolean().defaultValue(false);
```

### Array

- `minLength(integer)`: Minimum length of the array.
- `maxLength(integer)`: Maximum length of the array.
- `exactLength(integer)`: Exact length of the array.
- `empty(boolean)`: If array can be empty. Overwrites options.
- `unique(boolean)`: Only allow unique items (including objects and arrays).

```javascript
Validator.Array(Validator.String(), options);
Validator.Array(Validator.String(), options).minLength(5).maxLength(10);
Validator.Array(Validator.String(), options).exactLength(5);
Validator.Array(Validator.String(), options).empty(true);
```

### Boolean

```javascript
Validator.Boolean(options);
```

### Date

- `format(string | array)`: Format will get validated with [moment](https://github.com/moment/moment) as utc time in strict mode. Default format is the ISO6801 standard 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'.
- `parse(boolean)`: Parse date string to Date object.

```javascript
Validator.Date(format, options);
Validator.Date(null, options).format('YYYY-MM-DD');
Validator.Date('YYYY-MM-DD').parse(true);
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

- `minLength(integer)`: Minimum number of object properties.
- `maxLength(integer)`: Maximum number of object properties.
- `exactLength(integer)`: Exact number of object properties.
- `empty(boolean)`: If object can be empty. Overwrites options.
- `func(function, ...string)`: Call an async function with values of the given keys.

Add conditions to check multiple values against each other. Navigate to nested keys with a point separated path (e.g. 'nested.child.value').

- `conditions(object)`: Multiple conditions in a json structure.
- `gt(string, string)`: Key a must be greater then key b.
- `gte(string, string)`: Key a must be greater or equal then key b.
- `lt(string, string)`: Key a must be less then key b.
- `lte(string, string)`: Key a must be less or equal then key b.
- `equals(string, string)`: Key a must equal key b.
- `notEquals(string, string)`: Key a must not equal key b.
- `dependsOn(string, string)`: Key a dependsOn key b. Useful for optional parameters.
- `xor(string, string)`: Only one of theses key should be set. Useful for optional parameters.

```javascript
Validator.Object({name: Validator.String()}, options);
Validator.Object({name: Validator.String()}, options).minLength(5).maxLength(10);
Validator.Object({name: Validator.String()}, options).exactLength(5);
Validator.Object({name: Validator.String()}, options).empty(true);
Validator.Object({name: Validator.String(), age: Validator.Integer()}, options).func(fn, 'name', 'age');

Validator.Object({bigger: Validator.Integer(), smaller: Validator.Integer()}, options).equals('a', 'b');
Validator.Object({
  bigger: Validator.Integer(),
  smaller: Validator.Integer(),
  child: Validator.Object({
    smaller: Validator.Integer()
  })
}, options)
  .conditions({
    bigger: {
      gte: smaller
    },
    smaller: {
      equals: 'child.smaller'
    }
  });
```

### Regex

- `minLength(integer)`: Minimum length of the regex.
- `maxLength(integer)`: Maximum length of the regex.
- `exactLength(integer)`: Exact length of the regex.
- `empty(boolean)`: If string can be empty. Overwrites options.
- `message(string)`: Use a custom message if value does not match regular expression. The default message is 'Value does not match regular expression.'.

```javascript
Validator.Regex(/A-Z/, options);
Validator.Regex(/A-Z/, options).minLength(5).maxLength(20);
Validator.Regex(/A-Z/, options).exactLength(15);
Validator.Regex(/A-Z/, options).empty(true);
Validator.Regex(/A-Z/, options).message('Only uppercase letters.');
```

## Request

This is a special object to validate the express req object. It validates uri, query and body parameters, with different default settings:

- `uri(schema, options)`: Default: Parameters will get parsed to type and are required.
- `query(schema, options)`: Default: Parameters will get parsed to type and are optional.
- `body(schema, options)`: Default: Parameters will not get parsed to type and are required.

You can pass a Object or Array schema to each function or and just an object.

```javascript
const schema = Validator.Request()
  .uri({
    id: INTEGER()
  })
  .body({
    name: STRING()
  })
  .query(Validator.Object({
    deleted: BOOLEAN()
  }))

const req = {
  params: {
    id: '20'
  },
  query: {},
  body: {
    name: 'Jane Doe'
  }
}

await Validator.validate(schema, req);
/*
{
  params: {
    id: 20
  },
  query: {},
  body: {
    name: 'Jane Doe'
  }
}
*/
```

### String

- `minLength(integer)`: Minimum length of the string.
- `maxLength(integer)`: Maximum length of the string.
- `exactLength(integer)`: Exact length of the string.
- `empty(boolean)`: If string can be empty. Overwrites options.
- `trim(boolean)`: Trim whitespaces from string. Overwrites options.

```javascript
Validator.String(options);
Validator.String(options).minLength(5).maxLength(20);
Validator.String(options).exactLength(15);
Validator.String(options).empty(true);
```

## Express middleware

By default the Validator throws an error if the validation fails. It's recommended to wrap every route with an [async middleware](https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016) that catches the error and next it to an error handler middleware. Before this error handling middleware, you can use the provided middleware of this package.

The error middleware responds with a status code 400 and a json if the nexted error is an ValidationError object. Otherwise it will next the error.

options:

- `message (string)`: Define the error message.
- `details (boolean)`: Send details about validation failures. Default true.
- `next (boolean)`: Next the error after sending the response. Default false.

``` javascript
const eiv = require('@korbiniankuhn/express-input-validator');

app.use(eiv.middleware());

app.use(eiv.middleware({
  message: 'The input validation failed.',
  details: false,
  next: true
}));
```

## Example

This example shows how easy input validation gets. Due to the async middleware no try/catch block is required and only a single line of code at the beginning of the routes controller is necessary. The application is very resilient as every exception will be handled by the error middlewares that even internal server errors will result in an obscured response.

```javascript
const express = require('express');
const eiv = require('@korbiniankuhn/express-input-validator');
const app = express();

// Middleware to next all exception
const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Initialize the validator object
const validator = eiv.Validator();

// Define a schema for login data
const loginSchema = validator.Request()
  .body({
    email: validator.String(),
    password: validator.String()
  })

// Login route controller
app.post('/login', asyncMiddleware(async (req, res) => {
  await validator.validate(loginSchema, req);
  if (email === 'jan.doe@example.com' && password === 'secret') {
    res.send('success');
  } else {
    res.send('invalid credentials');
  }
}));

// Sent response on validation errors
app.use(eiv.middleware());

// Error handler
app.use((err, req, res) => {
  if (!res.headerSent) {
    res.send('Something went wrong');
  }
  // Do logging here
  console.log(err);
})

```

## Mongoose schema validation

The validator can also be used for the validation of mongoose schemas.

``` javascript
const schema = new Schema({
  name: {
    type: String,
    index: true,
    required: true
  },
  age: {
    type: Integer
  },
});

const validationSchema = validator.Object({
  name: validator.String().minLength(10).maxLength(50),
  age: validator.Integer().required(false),
});

schema.pre('save', async function (next) {
  await validator.validate(validationSchema, this.toObject()).catch(err => {
    next(err);
  });
  next();
});
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