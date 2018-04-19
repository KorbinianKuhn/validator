const {
  validateArray,
  validateSync,
  validate,
  validateItemsSync,
  validateItemsAsync
} = require("./../../../../src/validator/default/validation/array");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");
const {
  StringFactory
} = require("./../../../../src/validator/default/types/string");
const should = require("should");

describe("validator/default/validation/array", () => {
  const message = Message("en");

  it("validateArray() should return given value", () => {
    const actual = validateArray([], { message, required: true });
    actual.should.deepEqual([]);
  });

  it("validateArray() should return defaultValue", () => {
    const actual = validateArray(undefined, {
      message,
      required: true,
      defaultValue: []
    });
    actual.should.deepEqual([]);
  });

  it("validateArray() with null should verify", () => {
    const actual = validateArray(null, {
      allowed: [null]
    });
    should.equal(actual, null);
  });

  it("validateArray() with null should throw", () => {
    utils.shouldThrow(
      () =>
        validateArray(null, {
          message,
          required: true,
          allowed: []
        }),
      "Required but is null."
    );
  });

  it("validateArray() should throw", () => {
    utils.shouldThrow(
      () => validateArray("wrong", { message, required: true }),
      "Must be type array but is string."
    );
  });

  it("validateArray() should parse to array", () => {
    const actual = validateArray("true,false", {
      message,
      required: true,
      parse: true
    });
    actual.should.deepEqual(["true", "false"]);
  });

  it("validateArray() should try parse to array but fail", () => {
    utils.shouldThrow(
      () => validateArray(2, { message, required: true, parse: true }),
      "Must be type array but is number."
    );
  });

  it("validateArray() empty array should fail", () => {
    utils.shouldThrow(
      () => validateArray([], { message, empty: false }),
      "Array is empty."
    );
  });

  it("validateArray() empty array should verify", () => {
    const actual = validateArray([], {
      empty: true
    });
    actual.should.deepEqual([]);
  });

  it("validateArray() min length should fail", () => {
    utils.shouldThrow(
      () => validateArray([], { message, min: 1 }),
      "Must have at least 1 items."
    );
  });

  it("validateArray() min length should verify", () => {
    const actual = validateArray(["test"], {
      min: 1
    });
    actual.should.deepEqual(["test"]);
  });

  it("validateArray() max length should fail", () => {
    utils.shouldThrow(
      () => validateArray(["test", "test"], { message, max: 1 }),
      "Must have at most 1 items."
    );
  });

  it("validateArray() max length should verify", () => {
    const actual = validateArray(["test"], {
      max: 1
    });
    actual.should.deepEqual(["test"]);
  });

  it("validateArray() length should fail", () => {
    utils.shouldThrow(
      () => validateArray(["test", "test"], { message, length: 1 }),
      "Must have exactly 1 items."
    );
  });

  it("validateArray() length should verify", () => {
    const actual = validateArray(["test"], {
      length: 1
    });
    actual.should.deepEqual(["test"]);
  });

  it("validateArray() duplicate items should fail", () => {
    utils.shouldThrow(
      () => validateArray(["test", "test"], { message, unique: true }),
      "Items must be unique."
    );
  });

  it("validateArray() duplicate items should verify", () => {
    const actual = validateArray(["test", "test"], {
      unique: false
    });
    actual.should.deepEqual(["test", "test"]);
  });

  it("validateItemsSync() should verify", () => {
    const itemSchema = StringFactory({}, { message });
    const actual = validateItemsSync(["test"], itemSchema);
    actual.should.deepEqual(["test"]);
  });

  it("validateItemsSync() should fail", () => {
    const itemSchema = StringFactory({}, { message });
    utils.shouldThrow(() => validateItemsSync([true], itemSchema), {
      "0": "Must be type string but is boolean."
    });
  });

  it("validateItemsSync() without itemSchema should verify", () => {
    const actual = validateItemsSync(["test"]);
    actual.should.deepEqual(["test"]);
  });

  it("validateItemsAsync() should verify", async () => {
    const itemSchema = StringFactory({}, { message });
    const actual = await validateItemsAsync(["test"], itemSchema);
    actual.should.deepEqual(["test"]);
  });

  it("validateItemsAsync() should fail", async () => {
    const itemSchema = StringFactory({}, { message });
    await utils.shouldEventuallyThrow(validateItemsAsync([true], itemSchema), {
      "0": "Must be type string but is boolean."
    });
  });

  it("validateItemsAsync() without itemSchema should verify", async () => {
    const actual = await validateItemsAsync(["test"]);
    actual.should.deepEqual(["test"]);
  });

  it("validateSync() should return given value", () => {
    const actual = validateSync([], {});
    actual.should.deepEqual([]);
  });

  it("validate() should return given value", async () => {
    const actual = await validate([], {});
    actual.should.deepEqual([]);
  });
});
