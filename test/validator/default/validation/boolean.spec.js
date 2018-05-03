const {
  validateBoolean,
  validateSync,
  validate
} = require("./../../../../src/validator/default/validation/boolean");
const { Message } = require("./../../../../src/utils/message");
const helper = require("./../../../helper");
const should = require("should");

describe("validator/default/validation/boolean", () => {
  const message = Message("en");

  it("validateBoolean() should return given value", () => {
    const actual = validateBoolean(true, { message, required: true });
    actual.should.equal(true);
  });

  it("validateBoolean() should return defaultValue", () => {
    const actual = validateBoolean(undefined, {
      message,
      required: true,
      defaultValue: false
    });
    actual.should.equal(false);
  });

  it("validateBoolean() with null should verify", () => {
    const actual = validateBoolean(null, {
      allowed: [null]
    });
    should.equal(actual, null);
  });

  it("validateBoolean() with null should throw", () => {
    helper.shouldThrow(
      () =>
        validateBoolean(null, {
          message,
          required: true,
          allowed: []
        }),
      "Required but is null."
    );
  });

  it("validateBoolean() should throw", () => {
    helper.shouldThrow(
      () => validateBoolean("wrong", { message, required: true }),
      "Must be type boolean but is string."
    );
  });

  it("validateBoolean() should parse to boolean", () => {
    let actual = validateBoolean("true", {
      message,
      required: true,
      parse: true
    });
    actual.should.equal(true);

    actual = validateBoolean(0, { message, required: true, parse: true });
    actual.should.equal(false);
  });

  it("validateBoolean() should try parse to boolean but fail", () => {
    helper.shouldThrow(
      () => validateBoolean("wrong", { message, required: true, parse: true }),
      "Must be type boolean but is string."
    );
  });

  it("validateSync() should return given value", () => {
    const actual = validateSync(true, {});
    actual.should.equal(true);
  });

  it("validate() should return given value", async () => {
    const actual = await validate(false, {});
    actual.should.equal(false);
  });
});
