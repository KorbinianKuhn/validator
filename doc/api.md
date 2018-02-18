# Validator([options])

`options`:

- `requiredAsDefault (boolean)`: Sets all parameters of a schema as required if not specified otherwise. Default true.
- `throwValidationError (boolean)`: Throw an error if validation fails. Default true.
- `parseToType (boolean)`: Parse input data to type (e.g. 'true' -> true, '1.2' -> 1.2). Default true.
- `noEmptyStrings (boolean)`: Disallow empty strings. Default true.
- `trimStrings (boolean)`: Remove whitespaces from string. Default true.
- `noEmptyArrays (boolean)`: Disallow empty arrays. Default true.
- `noEmptyObjects (boolean)`: Disallow empty objects. Default true.
- `noUndefinedKeys (boolean)`: Disallow keys that are not defined by the schema. Default true.
- `parseDates (boolean)`: Parse date string to Date objects. Default true.
- `utc (boolean)`: Use UTC to parse dates. Default true.
- `strictDateValidation (boolean)`: Use strict date validation. Datestrings have to match exactly the given format. Default true.

## Types

All types created by a validator get the validators options as default options. These options can get overwritten for every type:

```javascript
const {validator = Validator({noEmptyStrings: true});
const schema = validator.Object({
  empty: validator.String({noEmptyStrings: false}),
  notEmpty: validator.String()
});

const data = { empty: '', notEmpty: 'hi' }

await schema.validate(data)
// { empty: '', notEmpty: 'hi' }
```

### Any([options])

The base type any is inherited by all other types, therefore the following functions are availabe for all types. An optional options object can be passed to the constructor with the same keys as the validators options.

- `default(value)`: Set a default value used if key is empty.
- `description(string)`:  Sets a description for the type. Useful for automated documentation generation.
- `example(example)`: Provide an example for the key. Useful for automated documentation generation.
- `examples(...examples)`: Provide multiple examples for the key. Useful for automated documentation generation.
- `name(string)`: Sets a custom name for the type. Useful for automated documentation generation.
- `parse(boolean)`: Parse string value to schema type.
- `required(boolean)`: Marks a key as required which will not allow `undefined` or `null` as value
- `toObject([options])`: Get a json object representation of the schema. Useful to generate documentations automatically.
- `validate(value)`: Validates the given value with the schema. If successfull the value will be returned, else an error is thrown.

Example:

``` javascript
const schema = validator.Any()
  .default(0)
  .description('ID of user')
  .example(0)
  .examples({ admin: 0 }, { user: 20 })
  .name('anything')
  .parse(false)
  .required(false)

await schema.validate(15)
// 15

// Get all information of the schema
schema.toObject()

// Export only information that can be used in raml documentations
schema.toObject({ type: 'raml' })
```

### Array(type, [options])

- `empty(boolean)`: If array can be empty. Overwrites options.
- `length(length)`: Exact length of the array.
- `min(length)`: Minimum length of the array.
- `max(length)`: Maximum length of the array.
- `unique(boolean)`: Only allow unique items (including objects and arrays).

Example:

```javascript
const schema = validator.Array(validator.Integer())
  .min(1)
  .max(3)
  .empty(false)
  .unique(true)

await schema.validate([0, 1, 2])
// [0, 1, 2]
```

### Boolean([options])

Example:

``` javascript
const schema = validator.Boolean()

await schema.validate(true)
// true
```

### Date ([options])

- `format(string | array)`: Format will get validated with [moment](https://github.com/moment/moment) as utc time in strict mode. Default format is the ISO6801 standard 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'.
- `min(date)`: Set a minimum valid date.
- `max(date)`: Set a maximum valid date.
- `strict(boolean)`: Use UTC timezone. Overrides options.
- `utc(boolean)`: Use strict date validation. Override options.

Example:

``` javascript
const schema = validator.Date()
  .format('YYYY-MM-DD')
  .min('2018-01-01')
  .max('2050-12-31')
  .strict(true)
  .utc(true)

await schema.validate('2019-01-01')
// 2019-01-01
```

### Enum(values, [options])

Example:

``` javascript
const schema = validator.Enum(['a', 'b', 'c'])

await schema.validate('a')
// a
```

### Function(func, [options])

### Integer([options])

- `greater(integer)`: Must be greater than value.
- `less(integer)`: Must be less than value.
- `max(integer)`: Maximum value.
- `min(integer)`: Minimum value.
- `negative()`: Must be a negative integer.
- `positive()`: Must be a positive integer.

Example:

``` javascript
const schema = validator.Integer()
  .min(0)
  .max(20)

await schema.validate(10)
// 10
```

### Number([options])

- `greater(number)`: Must be greater than value.
- `less(number)`:  Must be less than value.
- `max(number)`: Maximum value.
- `min(number)`: Minimum value.
- `negative()`: Must be a negative number.
- `positive()`: Must be a positive number.

Example:

``` javascript
const schema = validator.Number()
  .min(0)
  .max(20)

await schema.validate(9.5)
// 9.5
```

### Object(object, [options])

- `empty(boolean)`: If object can be empty. Overwrites options.
- `func(function, ...string)`: Call an async function with values of the given keys.
- `length(integer)`: Exact number of object properties.
- `max(integer)`: Maximum number of object properties.
- `min(integer)`: Minimum number of object properties.

Add conditions to check multiple values against each other. Navigate to nested keys with a point separated path (e.g. 'nested.child.value').

- `conditions(object)`: Multiple conditions in a json structure.
- `dependsOn(string, string)`: Key a dependsOn key b. Useful for optional parameters.
- `equals(string, string)`: Key a must equal key b.
- `gt(string, string)`: Key a must be greater then key b.
- `gte(string, string)`: Key a must be greater or equal then key b.
- `lt(string, string)`: Key a must be less then key b.
- `lte(string, string)`: Key a must be less or equal then key b.
- `notEquals(string, string)`: Key a must not equal key b.
- `xor(string, string)`: Only one of theses key should be set. Useful for optional parameters.

```javascript
const schema = validator.Object({
  bigger: validator.Integer(),
  smaller: validator.Integer()
}).gt('bigger', 'smaller')
  .dependsOn('bigger', 'smaller')
  .conditions({ bigger: { notEquals: 'smaller' } })

await schema.validate({ bigger: 10, smaller: 5 });
// { bigger: 10, smaller: 5 }
```

### Regex(regex, [options])

- `empty(boolean)`: If string can be empty. Override options.
- `length(length)`: Exact length of the string.
- `max(length)`: Maximum length of the string.
- `message(text, language)`: A custom message for regex failure. Default is: Value does not match regular expression.
- `min(length)`: : Minimum length of the string.

Exmaple:

```javascript
const schema = validator.Regex(/[A-Z]/)
  .min(5)
  .max(50)
  .message('Only uppercase letters', 'en')
  .message('Nur große Buchstaben', 'de')
  .empty(false)

await schema.validate('VERYBIG');
// VERYBIG
```

### String([options])

- `empty(boolean)`: If string can be empty. Overrides options.
- `length(length)`: Exact length of the string.
- `max(length)`: Maximum length of the string.
- `min(length)`: Minimum length of the string.
- `trim(boolean)`: Trim whitespaces from string. Overrides options.

Example:

```javascript
const schema = validator.String()
  .empty(false)
  .min(5)
  .max(20)
  .trim(true)

await schema.validate(' my  string ');
// my string
```