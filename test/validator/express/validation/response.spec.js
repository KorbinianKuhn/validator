const {
  validateResponse,
  validateResponseSync
} = require("./../../../../src/validator/express/validation/response");
const { Message } = require("./../../../../src/utils/message");
const {
  ExpressValidatorFactory
} = require("./../../../../src/validator/express/validator");
const utils = require("./../../../utils");

describe("validator/express/validation/response", () => {
  const message = Message("en");
  const validator = ExpressValidatorFactory();

  it("validateResponse() with wrong status should fail", async () => {
    const res = { status: 400 };
    await utils.shouldEventuallyThrow(
      validateResponse(res, { status: 200, message }),
      { status: "Must have status code 200 but has 400." }
    );
  });

  it("validateResponse() with correct status should verify", async () => {
    const res = { status: 200 };
    const actual = await validateResponse(res, { status: 200, message });
    actual.should.deepEqual(res);
  });

  it("validateResponse() with wrong body should fail", async () => {
    const res = { status: 200, body: {} };
    await utils.shouldEventuallyThrow(
      validateResponse(res, {
        status: 200,
        message,
        body: validator.Object({})
      }),
      { body: "Object is empty." }
    );
  });

  it("validateResponse() with correct body should verify", async () => {
    const res = { status: 200, body: { name: "test" } };
    const actual = await validateResponse(res, {
      status: 200,
      message,
      body: validator.Object({
        name: validator.String()
      })
    });
    actual.should.deepEqual(res);
  });

  it("validateResponseSync() with wrong status should fail", () => {
    const res = { status: 400 };
    utils.shouldThrow(
      () => validateResponseSync(res, { status: 200, message }),
      { status: "Must have status code 200 but has 400." }
    );
  });

  it("validateResponseSync() with correct status should verify", () => {
    const res = { status: 200 };
    const actual = validateResponseSync(res, { status: 200, message });
    actual.should.deepEqual(res);
  });

  it("validateResponseSync() with wrong body should fail", () => {
    const res = { status: 200, body: {} };
    utils.shouldThrow(
      () =>
        validateResponseSync(res, {
          status: 200,
          message,
          body: validator.Object({})
        }),
      { body: "Object is empty." }
    );
  });

  it("validateResponseSync() with correct body should verify", () => {
    const res = { status: 200, body: { name: "test" } };
    const actual = validateResponseSync(res, {
      status: 200,
      message,
      body: validator.Object({
        name: validator.String()
      })
    });
    actual.should.deepEqual(res);
  });
});
