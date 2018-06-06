# API Reference

- [API Reference](#api-reference)
  - [Validator([options])](#validatoroptions)
    - [addLocale(name, messages)](#addlocalename--messages)
    - [setLocale(name)](#setlocalename)
    - [addType(name, schema)](#addtypename--schema)
    - [Custom(name)](#customname)
    - [listCustomTypes()](#listcustomtypes)
    - [validate(schema, data)](#validateschema--data)
    - [validateSync(schema, data)](#validatesyncschema--data)
  - [Any([options])](#anyoptions)
    - [validate(value)](#validatevalue)
    - [validateSync(value)](#validatesyncvalue)
    - [required()](#required)
    - [optional()](#optional)
    - [description(description)](#descriptiondescription)
    - [example(example)](#exampleexample)
    - [default(value)](#defaultvalue)
    - [parse(boolean)](#parseboolean)
    - [only(...values)](#onlyvalues)
    - [not(...values)](#notvalues)
    - [allow(...values)](#allowvalues)
    - [func(func)](#funcfunc)
    - [toObject([options])](#toobjectoptions)
  - [Array([type, options])](#arraytype--options)
    - [min(length)](#minlength)
    - [max(length)](#maxlength)
    - [length(length)](#lengthlength)
    - [empty(boolean)](#emptyboolean)
    - [unique(boolean)](#uniqueboolean)
  - [Boolean([options])](#booleanoptions)
  - [Date([options])](#dateoptions)
    - [format(string)](#formatstring)
    - [utc(boolean)](#utcboolean)
    - [min(date)](#mindate)
    - [max(date)](#maxdate)
  - [Number([options])](#numberoptions)
    - [integer()](#integer)
    - [min(number)](#minnumber)
    - [max(number)](#maxnumber)
    - [less(number)](#lessnumber)
    - [greater(number)](#greaternumber)
    - [positive()](#positive)
    - [negative()](#negative)
  - [Object([object, options])](#objectobject--options)
    - [empty(boolean)](#emptyboolean)
    - [unknown(boolean)](#unknownboolean)
    - [func(func, ...keys)](#funcfunc--keys)
    - [min(length)](#minlength)
    - [max(length)](#maxlength)
    - [length(length)](#lengthlength)
    - [gt(a, b)](#gta--b)
    - [gte(a, b)](#gtea--b)
    - [lt(a, b)](#lta--b)
    - [lte(a, b)](#ltea--b)
    - [equals(a, b)](#equalsa--b)
    - [notEquals(a, b)](#notequalsa--b)
    - [dependsOn(a, b)](#dependsona--b)
    - [xor(a, b)](#xora--b)
    - [or(a, b)](#ora--b)
  - [String([options])](#stringoptions)
    - [min(length)](#minlength)
    - [max(length)](#maxlength)
    - [length(length)](#lengthlength)
    - [empty(boolean)](#emptyboolean)
    - [trim(boolean)](#trimboolean)
    - [regex(pattern, [locales])](#regexpattern--locales)

## Validator([options])

All types created by a validator get the validators options as default options. The options can get overwritten for every type.

`options`:

- `locale (string)`: The anguage locale. Default `en`
- `requiredAsDefault (boolean)`: Sets all parameters of a schema as required if not specified otherwise. Default `true`.
- `throwValidationErrors (boolean)`: Throw an error if validation fails. Default `true`.
- `parseToType (boolean)`: Parse input data to type (e.g. 'true' -> true, '1.2' -> 1.2). Default`true`,
- `emptyStrings (boolean)`: Allow empty strings. Default `false`,
- `trimStrings (boolean)`:  Trim strings. Default `true`,
- `emptyArrays (boolean)`:  Allow empty arrays. Default `false`,
- `emptyObjects (boolean)`: Allow empty objects. Default `false`,
- `unknownObjectKeys (boolean)`: Allow keys that are not defined by the schema. Default `false`,
- `parseDates (boolean)`: Parse date string to Date objects. Default `true`,
- `utc (boolean)`: Use UTC to parse dates. Default `true`,

### addLocale(name, messages)

Add a custom language pack. Check the locales folder for the available keys.

```javascript
validator.addLocale('custom', {
  wrong_type: "Beep",
  // ...
});
```

### setLocale(name)

Set the language.

```javascript
validator.setLocale('de');
```

### addType(name, schema)

Add a custom type to reuse it later.

```javascript
const address = validator.Object({
  street: validator.String(),
  postal: validator.Integer(),
  city: validator.String()
});

validator.addType('address', address);
```

### Custom(name)

Use a custom type.

```javascript
validator.Custom('address')
  .validate(value);
```

### listCustomTypes()

List all custom types.

```javascript
console.log(validator.listCustomTypes());
// [ 'address: OBJECT' ]
```

### validate(schema, data)

Validate a schema with the validator to return a `ValidationError` object.

```javascript
const validator = Validator();

validator.validate(validator.String(), undefined)
// ValidationError({
//   message: 'Invalid input parameters and/or values.',
//   code: 'validation_error',
//   type: 'validator',
//   details: 'Required but is undefined' 
// })
```

### validateSync(schema, data)

Validate a schema with the validator to return a `ValidationError` object.

```javascript
const validator = Validator();

validator.validateSync(validator.String(), undefined)
// ValidationError({
//   message: 'Invalid input parameters and/or values.',
//   code: 'validation_error',
//   type: 'validator',
//   details: 'Required but is undefined' 
// })
```

## Any([options])

The base type `Any` is inherited by all other types, therefore the following functions are availabe for all types. An optional options object can be passed to the constructor to overwrite the validators default options.

### validate(value)

Asynchronous validation of a schema.

```javascript
const schema = validator.Any();

schema.validate('test')
  .then(value => {
    // test
  });
```

### validateSync(value)

Synchronous validation of a schema.

```javascript
const schema = validator.Any();

schema.validateSync('test');
// test
```

### required()

Marks a key as required which will not allow undefined as value

```javascript
const schema = validator.Any()
  .required()
  .validate(undefined);
// throws
```

### optional()

Marks a key as optional which will allow undefined as value

```javascript
const schema = validator.Any()
  .optional()
  .validate(undefined);
// undefined
```

### description(description)

Sets a description for the type. Useful for automated documentation generation.

```javascript
const schema = validator.Any()
  .example("Any value is allowed.");
```

### example(example)

Provide an example for the key. Useful for automated documentation generation.

> If no parameter is given, the schemas example is returned

```javascript
const schema = validator.Any()
  .example("test");

schema.example();
// test
```

### default(value)

Set a default value used if key is empty.

```javascript
const schema = validator.Any()
  .default('test')
  .validate(undefined);
// test
```

### parse(boolean)

Parse value to schema type.

```javascript
const schema = validator.Boolean()
  .parse(true)
  .validate('true');
// true
```

### only(...values)

Only allow the given values.

```javascript
const schema = validator.Any()
  .only('test', 'hello')
  .validate('wrong');
// throws
```

### not(...values)

Disallow the given values.

```javascript
const schema = validator.Any()
  .not('test', 'hello')
  .validate('test');
// throws
```

### allow(...values)

Allow specific values.

```javascript
const schema = validator.Any()
  .allow(null, 'test')
  .validate(null);
// null
```

### func(func)

Use a custom function for validation. 
> validate() supports normal functions and async functions

> validateSync() only supports normal functions

> If the function has a return value, it will overwrite the given value

> The function can throw a literal or an error.

```javascript
const schema = validator.Any()
  .func((value) => {
    if (value === 'wrong') {
      throw 'So wrong.';
    } else {
      return 'test';
    });

schema.validate('wrong');
// throws

schema.validate('hello');
// test
```

### toObject([options])

Returns an object representation of the schema.

```javascript
const schema = validator.Number()
  .integer(true);
  
schema.toObject();
// { type: 'number', required: true, integer: true }

schema.toObject({ type: 'raml' });
// { type: 'integer', required: true }

```

## Array([type, options])

### min(length)

Set a minimum length of the array.

```javascript
const schema = validator.Array()
  .min(2)
  .validate(['test']);
// throws
```

### max(length)

Set a minimum length of the array.

```javascript
const schema = validator.Array()
  .max(1)
  .validate(['test', 'hello']);
// throws
```

### length(length)

Set the exact length of the array.

```javascript
const schema = validator.Array()
  .length(1)
  .validate(['test']);
// ['test']
```

### empty(boolean)

Allow array to be empty.

```javascript
const schema = validator.Array()
  .empty(false)
  .validate([]);
// throws
```

### unique(boolean)

Require unique array items.

```javascript
const schema = validator.Array()
  .unique(true)
  .validate(['test', 'test']);
// throws
```

## Boolean([options])

```javascript
const schema = validator.Boolean()
  .validate(false);
// false
```

## Date([options])

### format(string)

The given value will get validated with [moment](https://github.com/moment/moment). Default format is the ISO6801 standard 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'.

```javascript
const schema = validator.Date()
  .format('YYYY-MM-DD')
  .validate('2018');
// throws
```

### utc(boolean)

Use UTC time.

```javascript
const schema = validator.Date()
  .utc(true)
  .validate('2018');
// UTC Date object
```

### min(date)

Set a minimum date.

```javascript
const schema = validator.Date()
  .min('2018-01-01T00:00:00.000Z')
  .validate('2017-01-01T00:00:00.000Z');
// throws
```

### max(date)

Set a maximum date.

```javascript
const schema = validator.Date()
  .max('2018-01-01T00:00:00.000Z')
  .validate('2017-01-01T00:00:00.000Z');
// Date object
```

## Number([options])

### integer()

Require integer values.

```javascript
const schema = validator.Number()
  .integer()
  .validate(2.2);
// throws
```

### min(number)

Set a minimum value.

```javascript
const schema = validator.Number()
  .min(5)
  .validate(2.2);
// throws
```

### max(number)

Set a maximum value.

```javascript
const schema = validator.Number()
  .max(5)
  .validate(2.2);
// 2.2
```

### less(number)

Require value to be less than given number.

```javascript
const schema = validator.Number()
  .less(5)
  .validate(2.2);
// 2.2.
```

### greater(number)

Require value to be greater than given number.

```javascript
const schema = validator.Number()
  .greater(5)
  .validate(2.2);
// throws
```

### positive()

Require value to be a positive number.

```javascript
const schema = validator.Number()
  .positive()
  .validate(0);
// throws
```

### negative()

Require value to be a negative number.

```javascript
const schema = validator.Number()
  .negative()
  .validate(0);
// throws
```

## Object([object, options])

### empty(boolean)

Allow object to be empty.

```javascript
const schema = validator.Object()
  .empty(true)
  .validate({});
// {}
```

### unknown(boolean)

Allow unknown object keys.

```javascript
const schema = validator.Object({ name: validator.String() })
  .unknown(false)
  .validate({ name: 'Jane Doe', age: 26 });
// throws
```

### func(func, ...keys)

Execute a custom function with the values of the given keys as parameters.

> validate() supports async and sync functions

> validateSync() only supports sync functions

```javascript
const schema = validator.Object({ 
    name: validator.String(),
    age: validator.Number()
  })
  .func(async (name, age) => {}, 'name', 'age')
  .validate({ name: 'John Doe', age: 30 });
// { name: 'John Doe' }
```

### min(length)

Set a minimum number of object keys.

```javascript
const schema = validator.Object()
  .min(2)
  .validate({});
// throws
```

### max(length)

Set a maximum number of object keys.

```javascript
const schema = validator.Object({ name: validator.String() })
  .max(2)
  .validate({ name: 'John Doe' });
// { name: 'John Doe' }
```

### length(length)

Set the exact number of object keys.

```javascript
const schema = validator.Object({ name: validator.String() })
  .length(1)
  .validate({ name: 'John Doe' });
// { name: 'John Doe' }
```

### gt(a, b)

`a` must be greater than `b`

```javascript
const schema = validator.Object({
    a: validator.Number(),
    b: validator.Number()
  })
  .gt('a', 'b')
  .validate({ a: 0, b: 2})
// throws
```

### gte(a, b)

`a` must be greater than or equal `b`

```javascript
const schema = validator.Object({
    a: validator.Number(),
    b: validator.Number()
  })
  .gte('a', 'b')
  .validate({ a: 2, b: 2})
// { a: 2, b: 2}
```

### lt(a, b)

`a` must be less than `b`

```javascript
const schema = validator.Object({
    a: validator.Number(),
    b: validator.Number()
  })
  .lt('a', 'b')
  .validate({ a: 0, b: 2})
// { a: 0, b: 2}
```

### lte(a, b)

`a` must be less than or equal `b`

```javascript
const schema = validator.Object({
    a: validator.Number(),
    b: validator.Number()
  })
  .lte('a', 'b')
  .validate({ a: 5, b: 2})
// throws
```

### equals(a, b)

`a` must equal `b`

```javascript
const schema = validator.Object({
    a: validator.Number(),
    b: validator.Number()
  })
  .equals('a', 'b')
  .validate({ a: 5, b: 2})
// throws
```

### notEquals(a, b)

`a` must not equal `b`

```javascript
const schema = validator.Object({
    a: validator.Number(),
    b: validator.Number()
  })
  .notEquals('a', 'b')
  .validate({ a: 2, b: 2})
// throws
```

### dependsOn(a, b)

`a` dependsOn `b`

```javascript
const schema = validator.Object({
    a: validator.Number().optional(),
    b: validator.Number().optional()
  })
  .dependsOn('a', 'b')
  .validate({ a: 5 })
// throws
```

### xor(a, b)

Only `a` or `b` must be set.

```javascript
const schema = validator.Object({
    a: validator.Number().optional(),
    b: validator.Number().optional()
  })
  .xor('a', 'b')
  .validate({ })
// throws
```

### or(a, b)

Only `a` or `b` can be set.

```javascript
const schema = validator.Object({
    a: validator.Number().optional(),
    b: validator.Number().optional()
  })
  .or('a', 'b')
  .validate({ a: 2, b: 2})
// throws
```

## String([options])

### min(length)

Set minimum length of the string.

```javascript
const schema = validator.String()
  .min(10)
  .validate('test');
// throws
```

### max(length)

Set maximum length of the string.

```javascript
const schema = validator.String()
  .max(10)
  .validate('test');
// test
```

### length(length)

Set exact length of the string.

```javascript
const schema = validator.String()
  .length(4)
  .validate('test');
// test
```

### empty(boolean)

Allow string to be empty.

```javascript
const schema = validator.String()
  .empty(false)
  .validate('');
// throws
```

### trim(boolean)

Trim string.

```javascript
const schema = validator.String()
  .trim(true)
  .validate('  string with whitespaces   ');
// string with whitespaces
```

### regex(pattern, [locales])

Value must match the regular expression.

```javascript
const schema = validator.String()
  .regex(/[A-Z]/, {
    en: 'Only uppercase letters.',
    de: 'Nur Großbuchstaben'
  });

schema.validate('ABC');
// ABC

schema.validate('abc');
// Only uppercase letters.
```