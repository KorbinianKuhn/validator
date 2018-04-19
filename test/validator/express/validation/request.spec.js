const {
  isValidRequestObject,
  validateSchema,
  validateSchemaSync,
  validateRequest,
  validateRequestSync
} = require("./../../../../src/validator/express/validation/request");
const { Message } = require("./../../../../src/utils/message");
const {
  ExpressValidatorFactory
} = require("./../../../../src/validator/express/validator");
const utils = require("./../../../utils");
const should = require("should");

describe.only("validator/express/validation/request", () => {
  const message = Message("en");
  const validator = ExpressValidatorFactory();

  it("isValidRequestObject() should throw", () => {
    utils.shouldThrow(
      () => isValidRequestObject({}, message),
      "Invalid express req object."
    );
  });

  it("isValidRequestObject() should verify", () => {
    isValidRequestObject({ params: {}, query: {}, body: {} }, message);
  });

  it("validateSchemaSync() unknown uri parameters should return error", () => {
    validateSchemaSync({ key: "value" }, undefined, message, {
      unknown: false,
      type: "params"
    }).should.equal("URI parameters are not allowed.");
  });

  it("validateSchemaSync() unknown query parameters should return error", () => {
    validateSchemaSync({ key: "value" }, undefined, message, {
      unknown: false,
      type: "query"
    }).should.equal("Query parameters are not allowed.");
  });

  it("validateSchemaSync() unknown body parameters should return error", () => {
    validateSchemaSync({ key: "value" }, undefined, message, {
      unknown: false,
      type: "body"
    }).should.equal("Body parameters are not allowed.");
  });

  it("validateSchema() unknown uri parameters should return error", async () => {
    const error = await validateSchema({ key: "value" }, undefined, message, {
      unknown: false,
      type: "params"
    });
    error.should.equal("URI parameters are not allowed.");
  });

  it("validateSchemaSync() unknown uri parameters should verify", () => {
    const actual = validateSchemaSync({ key: "value" }, undefined, message, {
      unknown: true,
      type: "params"
    });
    should.equal(actual, null);
  });

  it("validateSchema() unknown uri parameters should verify", async () => {
    const actual = await validateSchema({ key: "value" }, undefined, message, {
      unknown: true,
      type: "params"
    });
    should.equal(actual, null);
  });

  it("validateSchemaSync() with empty object and schema should return error", () => {
    const schema = validator.Object({ key: validator.String() });
    const error = validateSchemaSync({}, schema, message, {});
    error.should.equal("Object is empty.");
  });

  it("validateSchemaSync() with unknown key and optional schema should return error", () => {
    const schema = validator.Object({}).optional();
    const error = validateSchemaSync({ key: "value" }, schema, message, {});
    error.should.deepEqual({ key: "Unknown key." });
  });

  it("validateSchemaSync() with empty object and optional schema should verify", () => {
    const schema = validator.Object({}).optional();
    const actual = validateSchemaSync({}, schema, message, {});
    should.equal(actual, null);
  });

  it("validateSchema() with empty object and schema should return error", async () => {
    const schema = validator.Object({ key: validator.String() });
    const error = await validateSchema({}, schema, message, {});
    error.should.equal("Object is empty.");
  });

  it("validateSchema() with unknown key and optional schema should return error", async () => {
    const schema = validator.Object({}).optional();
    const error = await validateSchema({ key: "value" }, schema, message, {});
    error.should.deepEqual({ key: "Unknown key." });
  });

  it("validateSchema() with empty object and optional schema should verify", async () => {
    const schema = validator.Object({}).optional();
    const actual = await validateSchema({}, schema, message, {});
    should.equal(actual, null);
  });
});
