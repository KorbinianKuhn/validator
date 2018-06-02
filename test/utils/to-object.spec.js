const { ValidatorFactory } = require('./../../src/validator/default/validator');
const {
  ExpressValidatorFactory
} = require('./../../src/validator/express/validator');
const { toObject } = require('./../../src/utils/to-object');

describe('toObject()', () => {
  const validator = ValidatorFactory();

  test('should return default object specification', () => {
    const test = { type: 'none' };
    expect(toObject(test, { type: 'raml' })).toEqual(test);
  });

  test('should return default object specification', () => {
    const test = { type: 'none' };
    expect(toObject(test)).toEqual(test);
  });

  test('should return any raml specification', () => {
    expect(
      validator
        .Any()
        .only('test')
        .example('test')
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'any',
      required: true,
      example: 'test',
      enum: ['test']
    });
  });

  test('should return array raml specification', () => {
    expect(
      validator
        .Array(validator.Any())
        .only('test')
        .example(['test'])
        .min(1)
        .max(4)
        .unique(true)
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'array',
      required: true,
      example: ['test'],
      enum: ['test'],
      items: {
        type: 'any',
        required: true,
        example: 'No example provided'
      },
      minItems: 1,
      maxItems: 4,
      uniqueItems: true
    });
  });

  test('should return boolean raml specification', () => {
    expect(
      validator
        .Boolean()
        .only(true)
        .example(true)
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'boolean',
      required: true,
      example: true,
      enum: [true]
    });
  });

  test('should return date raml specification', () => {
    expect(
      validator
        .Date()
        .only('2018-01-01')
        .example('2018-01-01')
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'datetime',
      required: true,
      example: '2018-01-01',
      enum: ['2018-01-01']
    });
  });

  test('should return number raml specification', () => {
    expect(
      validator
        .Number()
        .only(2)
        .example(2)
        .min(2)
        .max(2)
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'number',
      required: true,
      example: 2,
      enum: [2],
      minimum: 2,
      maximum: 2
    });
  });

  test('should return integer raml specification', () => {
    expect(
      validator
        .Number()
        .integer()
        .only(2)
        .example(2)
        .min(2)
        .max(2)
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'integer',
      required: true,
      example: 2,
      enum: [2],
      minimum: 2,
      maximum: 2
    });
  });

  test('should return object raml specification', () => {
    expect(
      validator
        .Object({
          name: validator.Any()
        })
        .only({})
        .example({})
        .min(1)
        .max(2)
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'object',
      required: true,
      example: {},
      enum: [{}],
      minProperties: 1,
      maxProperties: 2,
      properties: {
        name: {
          type: 'any',
          required: true,
          example: 'No example provided'
        }
      }
    });
  });

  test('should return string raml specification', () => {
    expect(
      validator
        .String()
        .only('test')
        .example('test')
        .regex(/[a-z]/)
        .toObject({ type: 'raml' })
    ).toEqual({
      type: 'string',
      required: true,
      example: 'test',
      enum: ['test'],
      pattern: /[a-z]/
    });
  });

  test('should return request raml specification', () => {
    const expressValidator = ExpressValidatorFactory();
    expect(
      expressValidator
        .Request()
        .params({
          name: expressValidator.String()
        })
        .query({
          limit: expressValidator.Boolean().optional()
        })
        .body(expressValidator.Array())
        .toObject({ type: 'raml' })
    ).toEqual({
      uriParameters: {
        name: {
          type: 'string',
          required: true,
          example: 'No example provided'
        }
      },
      queryParameters: {
        limit: {
          type: 'boolean',
          required: false,
          example: 'No example provided'
        }
      },
      body: {
        'application/json': {
          type: 'array',
          required: true,
          example: 'No example provided'
        }
      }
    });
  });

  test('should return request raml specification without params, body and query', () => {
    const expressValidator = ExpressValidatorFactory();
    expect(expressValidator.Request().toObject({ type: 'raml' })).toEqual({});
  });

  test('should return response raml specification', () => {
    const expressValidator = ExpressValidatorFactory();
    expect(
      expressValidator
        .Response()
        .description('description')
        .status(400)
        .body({})
        .toObject({ type: 'raml' })
    ).toEqual({
      400: {
        description: 'description',
        body: {
          'application/json': {
            example: {},
            properties: {},
            required: true,
            type: 'object'
          }
        }
      }
    });
  });

  test('should return request raml specification without body', () => {
    const expressValidator = ExpressValidatorFactory();
    expect(expressValidator.Response().toObject({ type: 'raml' })).toEqual({
      200: {}
    });
  });
});
