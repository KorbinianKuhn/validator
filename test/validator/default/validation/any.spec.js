const {
  validateRequired,
  validateOnly,
  validateNot,
  validateFunctionSync,
  validateFunctionAsync,
  validateAny,
  validateSync,
  validate
} = require("./../../../../src/validator/default/validation/any");
const { Message } = require("./../../../../src/utils/message");
const helper = require("./../../../helper");
const should = require("should");

describe("validator/default/validation/any", () => {
  const message = Message("en");
  it("validateRequired() should throw", () => {
    helper.shouldThrow(
      () => validateRequired(undefined, true, message),
      "Required but is undefined."
    );
  });

  it("validateOnly() should throw", () => {
    helper.shouldThrow(
      () => validateOnly(["test", "test2"], "hello", message),
      "Only 'test, test2' is allowed."
    );
  });

  it("validateOnly() should not throw", () => {
    validateOnly(["test"], "test", message);
  });

  it("validateOnly() with undefined only should not throw", () => {
    validateOnly(undefined, "test", message);
  });

  it("validateNot() should throw", () => {
    helper.shouldThrow(
      () => validateNot(["test"], "test", message),
      "Is not allowed."
    );
  });

  it("validateNot() should not throw", () => {
    validateNot(["test"], "hello", message);
  });

  it("validateNot() with undefined not should not throw", () => {
    validateNot(undefined, "test", message);
  });

  it("validateFunctionSync() should throw", () => {
    const func = value => {
      throw new Error("message");
    };
    helper.shouldThrow(
      () => validateFunctionSync(func, "test", message),
      "message"
    );
  });

  it("validateFunctionSync() should not throw", () => {
    const func = value => value;
    const actual = validateFunctionSync(func, "test", message);
    actual.should.equal("test");
  });

  it("validateFunctionSync() without function should not throw", () => {
    const actual = validateFunctionSync(undefined, "test", message);
    actual.should.equal("test");
  });

  it("validateFunctionSync() should return function value", () => {
    const func = value => "hello";
    const actual = validateFunctionSync(func, "test", message);
    actual.should.equal("hello");
  });

  it("validateFunctionAsync() should throw", async () => {
    const func = value => Promise.reject("message");
    await helper.shouldEventuallyThrow(
      validateFunctionAsync(func, "test", message),
      "message"
    );
  });

  it("validateFunctionAsync() should not throw", async () => {
    const func = value => Promise.resolve(value);
    const actual = await validateFunctionAsync(func, "test", message);
    actual.should.equal("test");
  });

  it("validateFunctionAsync() without function should not throw", async () => {
    const actual = await validateFunctionAsync(undefined, "test", message);
    actual.should.equal("test");
  });

  it("validateFunctionAsync() should return function value", async () => {
    const func = value => Promise.resolve("hello");
    const actual = await validateFunctionAsync(func, "test", message);
    actual.should.equal("hello");
  });

  it("validateAny() should return given value", () => {
    const actual = validateAny("test", { message, required: true });
    actual.should.equal("test");
  });

  it("validateAny() should return defaultValue", () => {
    const actual = validateAny(undefined, {
      message,
      required: true,
      defaultValue: "test"
    });
    actual.should.equal("test");
  });

  it("validateAny() with null should verify", () => {
    const actual = validateAny(null, {
      allowed: [null]
    });
    should.equal(actual, null);
  });

  it("validateAny() with null should throw", () => {
    helper.shouldThrow(
      () =>
        validateAny(null, {
          message,
          required: true,
          allowed: []
        }),
      "Required but is null."
    );
  });

  it("validateSync() should return given value", () => {
    const actual = validateSync("test", {});
    actual.should.equal("test");
  });

  it("validate() should return given value", async () => {
    const actual = await validate("test", {});
    actual.should.equal("test");
  });
});
