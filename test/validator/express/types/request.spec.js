const {
  RequestFactory,
  toSchema
} = require('./../../../../src/validator/express/types/request');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');
const {
  ExpressValidatorFactory
} = require('./../../../../src/validator/express/validator');

describe('validator/express/types/request', () => {
  const message = Message('en');
  const validator = ExpressValidatorFactory();

  test('RequestFactory() should return REQUEST object', () => {
    expect(RequestFactory().constructor.name).toBe('REQUEST');
  });

  test('options() should return options', () => {
    const description = 'description';
    const params = validator.Params({});
    const query = validator.Query({});
    const body = validator.Body({});

    const schema = RequestFactory()
      .description(description)
      .params(params)
      .query(query)
      .body(body);

    expect(schema.options({ validation: true })).toEqual({
      unknown: true,
      message,
      params,
      query,
      body
    });

    expect(schema.options()).toEqual({
      type: 'request',
      description,
      unknown: true
    });
  });

  test('toObject() should return object', () => {
    const description = 'description';

    const schema = RequestFactory().description(description);

    expect(schema.toObject()).toEqual({
      type: 'request',
      description,
      unknown: true
    });
  });

  test('validateSync() should verify', () => {
    const req = { params: {}, query: {}, body: {} };
    expect(RequestFactory().validateSync(req)).toBe(req);
  });

  test('validateSync() should fail', () => {
    const req = { params: {}, query: {}, body: {} };
    helper.shouldThrow(
      () =>
        RequestFactory({ message, requiredAsDefault: true }, {})
          .params({ name: validator.String() })
          .validateSync(req),
      {
        params: { name: 'Required but is undefined.' }
      }
    );
  });

  test('validateAsync() should verify', async () => {
    const req = { params: {}, query: {}, body: {} };
    await RequestFactory()
      .validate(req)
      .then(value => {
        expect(value).toBe(req);
      });
  });

  test('validateAsync() should fail', async () => {
    const req = { params: {}, query: {}, body: {} };
    await helper.shouldEventuallyThrow(
      RequestFactory({ message, requiredAsDefault: true }, {})
        .params({ name: validator.String() })
        .validate(req),
      {
        params: { name: 'Required but is undefined.' }
      }
    );
  });

  test('toSchema() no object should fail', () => {
    helper.shouldThrow(
      () => toSchema(undefined, {}, {}, message),
      'Validator configuration error: Invalid schema.'
    );
  });

  test('toSchema() invalid object should fail', () => {
    helper.shouldThrow(
      () => toSchema([], {}, {}, message),
      'Validator configuration error: Must be object or array schema.'
    );
  });

  test('toSchema() plain object should verify', () => {
    const schema = toSchema({}, {}, {}, message);
    expect(schema.constructor.name).toBe('OBJECT');
  });

  test('toSchema() should return given schema', () => {
    const expected = validator.Object({});
    const actual = toSchema(expected, {}, {}, message);
    expect(actual).toBe(expected);
  });

  test('toSchema() with array should fail', () => {
    helper.shouldThrow(
      () => toSchema(validator.Array(), {}, {}, message),
      'Validator configuration error: Invalid schema.'
    );
  });
});
