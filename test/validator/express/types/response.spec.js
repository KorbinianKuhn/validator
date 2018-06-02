const {
  ResponseFactory
} = require('./../../../../src/validator/express/types/response');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');
const {
  ExpressValidatorFactory
} = require('./../../../../src/validator/express/validator');

describe('validator/express/types/response', () => {
  const message = Message('en');
  const validator = ExpressValidatorFactory();

  test('ResponseFactory() should return RESPONSE object', () => {
    expect(ResponseFactory(validator.Object({})).constructor.name).toBe(
      'RESPONSE'
    );
  });

  test('options() should return options', () => {
    const description = 'description';
    const status = 300;
    const body = validator.Object({});

    const schema = ResponseFactory()
      .description(description)
      .status(300)
      .body(body);

    expect(schema.options({ validation: true })).toEqual({
      message,
      status,
      body
    });

    expect(schema.options()).toEqual({
      type: 'response',
      description,
      status
    });
  });

  test('toObject() should return object', () => {
    const description = 'description';
    const body = validator.Object({});

    const schema = ResponseFactory()
      .body(body)
      .description(description);

    expect(schema.toObject()).toEqual({
      type: 'response',
      description,
      body: body.toObject(),
      status: 200
    });
  });

  test('validateSync() should fail', () => {
    const body = validator.Object({ name: validator.String() });
    const res = { status: 300, body: { name: undefined } };
    helper.shouldThrow(
      () =>
        ResponseFactory()
          .body(body)
          .validateSync(res),
      {
        body: { name: 'Required but is undefined.' },
        status: 'Must have status code 200 but has 300.'
      }
    );
  });

  test('validateSync() should verify', () => {
    const body = validator.Object({ name: validator.String() });
    const expected = { status: 200, body: { name: 'Jane Doe' } };
    const actual = ResponseFactory()
      .body(body)
      .validateSync(expected);
    expect(actual).toEqual(expected);
  });

  test('validateAsync() should fail', async () => {
    const body = validator.Object({ name: validator.String() });
    const res = { status: 300, body: { name: undefined } };
    await helper.shouldEventuallyThrow(
      ResponseFactory()
        .body(body)
        .validate(res),
      {
        body: { name: 'Required but is undefined.' },
        status: 'Must have status code 200 but has 300.'
      }
    );
  });

  test('validateAsync() should verify', async () => {
    const body = validator.Object({ name: validator.String() });
    const expected = { status: 200, body: { name: 'Jane Doe' } };
    const actual = await ResponseFactory()
      .body(body)
      .validate(expected);
    expect(actual).toEqual(expected);
  });

  test('toObject() should return object without body', () => {
    const description = 'description';

    const schema = ResponseFactory().description(description);

    expect(schema.toObject()).toEqual({
      type: 'response',
      description,
      status: 200
    });
  });

  test('example() should return body example', () => {
    const body = validator.Object({}).example({ test: 'value' });

    const schema = ResponseFactory().body(body);

    expect(schema.toObject()).toEqual({
      type: 'response',
      status: 200,
      body: body.toObject()
    });
  });

  test('body() with invalid schema should throw', () => {
    helper.shouldThrow(
      () => ResponseFactory().body(undefined),
      'Validator configuration error: Invalid schema.'
    );
  });

  test('body() with unknown schema should throw', () => {
    helper.shouldThrow(
      () => ResponseFactory().body('test'),
      'Validator configuration error: Unknown schema.'
    );
  });
});
