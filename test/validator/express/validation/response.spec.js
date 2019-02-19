const {
  validateResponse,
  validateResponseSync
} = require('./../../../../src/validator/express/validation/response');
const { Message } = require('./../../../../src/utils/message');
const {
  ExpressValidatorFactory
} = require('./../../../../src/validator/express/validator');
const helper = require('./../../../helper');

describe('validator/express/validation/response', () => {
  const message = Message('en');
  const validator = ExpressValidatorFactory();

  test('validateResponse() with wrong status should fail', async () => {
    const res = { status: 400 };
    await helper.shouldEventuallyThrow(
      validateResponse(res, { status: 200, message }),
      { status: 'Must have status code 200 but has 400.' }
    );
  });

  test('validateResponse() with correct status should verify', async () => {
    const res = { status: 200 };
    const actual = await validateResponse(res, { status: 200, message });
    expect(actual).toEqual(res);
  });

  test('validateResponse() with wrong body should fail', async () => {
    const res = { status: 200, body: {} };
    await helper.shouldEventuallyThrow(
      validateResponse(res, {
        status: 200,
        message,
        body: validator.Object({})
      }),
      { body: 'Object is empty.' }
    );
  });

  test('validateResponse() with correct body should verify', async () => {
    const res = { status: 200, body: { name: 'test' } };
    const actual = await validateResponse(res, {
      status: 200,
      message,
      body: validator.Object({
        name: validator.String()
      })
    });
    expect(actual).toEqual(res);
  });

  test('validateResponseSync() with wrong status should fail', () => {
    const res = { status: 400 };
    helper.shouldThrow(
      () => validateResponseSync(res, { status: 200, message }),
      { status: 'Must have status code 200 but has 400.' }
    );
  });

  test('validateResponseSync() with correct status should verify', () => {
    const res = { status: 200 };
    const actual = validateResponseSync(res, { status: 200, message });
    expect(actual).toEqual(res);
  });

  test('validateResponseSync() with wrong body should fail', () => {
    const res = { status: 200, body: {} };
    helper.shouldThrow(
      () =>
        validateResponseSync(res, {
          status: 200,
          message,
          body: validator.Object({})
        }),
      { body: 'Object is empty.' }
    );
  });

  test('validateResponseSync() with correct body should verify', () => {
    const res = { status: 200, body: { name: 'test' } };
    const actual = validateResponseSync(res, {
      status: 200,
      message,
      body: validator.Object({
        name: validator.String()
      })
    });
    expect(actual).toEqual(res);
  });
});
