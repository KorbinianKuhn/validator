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

  it('ResponseFactory() should return RESPONSE object', () => {
    ResponseFactory(validator.Object({})).constructor.name.should.equal(
      'RESPONSE'
    );
  });

  it('options() should return options', () => {
    const description = 'description';
    const status = 300;
    const body = validator.Object({});

    const schema = ResponseFactory()
      .description(description)
      .status(300)
      .body(body);

    schema.options({ validation: true }).should.deepEqual({
      message,
      status,
      body
    });

    schema.options().should.deepEqual({
      type: 'response',
      description,
      status
    });
  });

  it('toObject() should return object', () => {
    const description = 'description';
    const body = validator.Object({});

    const schema = ResponseFactory()
      .body(body)
      .description(description);

    schema.toObject().should.deepEqual({
      type: 'response',
      description,
      body: body.toObject(),
      status: 200
    });
  });

  it('validateSync() should fail', () => {
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

  it('validateSync() should verify', () => {
    const body = validator.Object({ name: validator.String() });
    const expected = { status: 200, body: { name: 'Jane Doe' } };
    const actual = ResponseFactory()
      .body(body)
      .validateSync(expected);
    actual.should.deepEqual(expected);
  });

  it('validateAsync() should fail', async () => {
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

  it('validateAsync() should verify', async () => {
    const body = validator.Object({ name: validator.String() });
    const expected = { status: 200, body: { name: 'Jane Doe' } };
    const actual = await ResponseFactory()
      .body(body)
      .validate(expected);
    actual.should.deepEqual(expected);
  });

  it('toObject() should return object without body', () => {
    const description = 'description';

    const schema = ResponseFactory().description(description);

    schema.toObject().should.deepEqual({
      type: 'response',
      description,
      status: 200
    });
  });

  it('example() should return body example', () => {
    const body = validator.Object({}).example({ test: 'value' });

    const schema = ResponseFactory().body(body);

    schema.toObject().should.deepEqual({
      type: 'response',
      status: 200,
      body: body.toObject()
    });
  });

  it('body() with invalid schema should throw', () => {
    helper.shouldThrow(
      () => ResponseFactory().body(undefined),
      'Validator configuration error: Invalid schema.'
    );
  });

  it('body() with unknown schema should throw', () => {
    helper.shouldThrow(
      () => ResponseFactory().body('test'),
      'Validator configuration error: Unknown schema.'
    );
  });
});
