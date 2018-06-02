const {
  isValidRequestObject,
  validateSchema,
  validateSchemaSync,
  validateRequest,
  validateRequestSync
} = require('./../../../../src/validator/express/validation/request');
const { Message } = require('./../../../../src/utils/message');
const {
  ExpressValidatorFactory
} = require('./../../../../src/validator/express/validator');
const helper = require('./../../../helper');

describe('validator/express/validation/request', () => {
  const message = Message('en');
  const validator = ExpressValidatorFactory();

  test('isValidRequestObject() should throw', () => {
    helper.shouldThrow(
      () => isValidRequestObject('wrong', message),
      'Invalid express req object.'
    );
  });

  test('isValidRequestObject() with missing keys should throw', () => {
    helper.shouldThrow(
      () => isValidRequestObject({}, message),
      'Invalid express req object.'
    );
  });

  test('isValidRequestObject() should verify', () => {
    isValidRequestObject({ params: {}, query: {}, body: {} }, message);
  });

  test('validateSchemaSync() unknown uri parameters should return error', () => {
    expect(
      validateSchemaSync({ key: 'value' }, undefined, message, {
        unknown: false,
        type: 'params'
      })
    ).toBe('URI parameters are not allowed.');
  });

  test('validateSchemaSync() unknown query parameters should return error', () => {
    expect(
      validateSchemaSync({ key: 'value' }, undefined, message, {
        unknown: false,
        type: 'query'
      })
    ).toBe('Query parameters are not allowed.');
  });

  test('validateSchemaSync() unknown body parameters should return error', () => {
    expect(
      validateSchemaSync({ key: 'value' }, undefined, message, {
        unknown: false,
        type: 'body'
      })
    ).toBe('Body parameters are not allowed.');
  });

  test('validateSchema() unknown uri parameters should return error', async () => {
    const error = await validateSchema({ key: 'value' }, undefined, message, {
      unknown: false,
      type: 'params'
    });
    expect(error).toBe('URI parameters are not allowed.');
  });

  test('validateSchemaSync() unknown uri parameters should verify', () => {
    const actual = validateSchemaSync({ key: 'value' }, undefined, message, {
      unknown: true,
      type: 'params'
    });
    expect(actual).toBe(null);
  });

  test('validateSchema() unknown uri parameters should verify', async () => {
    const actual = await validateSchema({ key: 'value' }, undefined, message, {
      unknown: true,
      type: 'params'
    });
    expect(actual).toBe(null);
  });

  test('validateSchemaSync() with empty object and schema should return error', () => {
    const schema = validator.Object({ key: validator.String() });
    const error = validateSchemaSync({}, schema, message, {});
    expect(error).toBe('Object is empty.');
  });

  test('validateSchemaSync() with unknown key and optional schema should return error', () => {
    const schema = validator.Object({}).optional();
    const error = validateSchemaSync({ key: 'value' }, schema, message, {});
    expect(error).toEqual({ key: 'Unknown key.' });
  });

  test('validateSchemaSync() with empty object and optional schema should verify', () => {
    const schema = validator.Object({}).optional();
    const actual = validateSchemaSync({}, schema, message, {});
    expect(actual).toBe(null);
  });

  test('validateSchema() with empty object and schema should return error', async () => {
    const schema = validator.Object({ key: validator.String() });
    const error = await validateSchema({}, schema, message, {});
    expect(error).toBe('Object is empty.');
  });

  test('validateSchema() with unknown key and optional schema should return error', async () => {
    const schema = validator.Object({}).optional();
    const error = await validateSchema({ key: 'value' }, schema, message, {});
    expect(error).toEqual({ key: 'Unknown key.' });
  });

  test('validateSchema() with empty object and optional schema should verify', async () => {
    const schema = validator.Object({}).optional();
    const actual = await validateSchema({}, schema, message, {});
    expect(actual).toBe(null);
  });

  test('validateRequest() with empty schema should verify', async () => {
    const req = { params: {}, query: {}, body: {} };
    const actual = await validateRequest(req, { message });
    expect(actual).toEqual(req);
  });

  test('validateRequest() with schema should verify', async () => {
    const req = { params: { name: 'Jane Doe' }, query: {}, body: {} };
    const params = validator.Object({ name: validator.String() });
    const actual = await validateRequest(req, {
      params,
      message
    });
    expect(actual).toEqual(req);
  });

  test('validateRequest() with schema and invalid data should throw', async () => {
    const req = { params: { name: false }, query: {}, body: {} };
    const params = validator.Object({ name: validator.String() });
    await helper.shouldEventuallyThrow(
      validateRequest(req, {
        params,
        message
      }),
      {
        params: {
          name: 'Must be type string but is boolean.'
        }
      }
    );
  });

  test('validateRequestSync() with empty schema should verify', () => {
    const req = { params: {}, query: {}, body: {} };
    const actual = validateRequestSync(req, { message });
    expect(actual).toEqual(req);
  });

  test('validateRequestSync() with schema should verify', () => {
    const req = { params: { name: 'Jane Doe' }, query: {}, body: {} };
    const params = validator.Object({ name: validator.String() });
    const actual = validateRequestSync(req, {
      params,
      message
    });
    expect(actual).toEqual(req);
  });

  test('validateRequestSync() with schema and invalid data should throw', () => {
    const req = { params: { name: false }, query: {}, body: {} };
    const params = validator.Object({ name: validator.String() });
    helper.shouldThrow(
      () =>
        validateRequestSync(req, {
          params,
          message
        }),
      {
        params: {
          name: 'Must be type string but is boolean.'
        }
      }
    );
  });
});
