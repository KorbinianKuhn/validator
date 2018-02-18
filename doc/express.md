# ExpressValidator([options])

Inherits all types from the default validator and extends them with a special Request Type to validate expressjs requests.

## Types

### Request

This is a special object to validate the express req object. It validates params, query and body parameters, with different default settings:

- `params(schema, options)`: Default: Parameters will get parsed to type and are required.
- `query(schema, options)`: Default: Parameters will get parsed to type and are optional.
- `body(schema, options)`: Default: Parameters will not get parsed to type and are required.

You can pass a Object or Array schema to each function or and just an object.

```javascript
const schema = validator.Request()
  .params({ id: INTEGER() })
  .body({ name: STRING() })
  .query(validator.Object({ deleted: BOOLEAN() }))

const req = {
  params: { id: '20' },
  query: {},
  body: { name: 'Jane Doe' }
}

await validator.validate(schema, req);
/*
{ 
  params: { id: 20 },
  query: {},
  body: { name: 'Jane Doe' }
}
*/
```

## middleware

By default the Validator throws an error if the validation fails. It's recommended to wrap every route with an [async middleware](https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016) that catches the error and next it to an error handler middleware. Before this error handling middleware, you can use the provided middleware of this package.

The error middleware responds with a status code 400 and a json if the nexted error is an ValidationError object. Otherwise it will next the error.

options:

- `message (string)`: Define the error message.
- `details (boolean)`: Send details about validation failures. Default true.
- `next (boolean)`: Next the error after sending the response. Default false.

``` javascript
const { ExpressValidator } = require('@korbiniankuhn/validator');
const validator = ExpressValidator();

app.use(validator.middleware());

app.use(validator.middleware({
  message: 'The input validation failed.',
  details: false,
  next: true
}));
```

## Example

This example shows how easy input validation gets. Due to the async middleware no try/catch block is required and only a single line of code at the beginning of the routes controller is necessary. The application is very resilient as every exception will be handled by the error middlewares that even internal server errors will result in an obscured response.

```javascript
const express = require('express');
const { ExpressValidator } = require('@korbiniankuhn/validator');
const app = express();

// Middleware to next all exception
const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Initialize the validator object
const validator = ExpressValidator();

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
app.use(validator.middleware());

// Error handler
app.use((err, req, res) => {
  if (!res.headerSent) {
    res.send('Something went wrong');
  }
  // Do logging here
  console.log(err);
})
```