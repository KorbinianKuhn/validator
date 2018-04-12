const {
  validateString,
  validateSync,
  validate
} = require("./../../../../src/validator/default/validation/string");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/validation/string", () => {
  const message = Message("en");

  it("validateString() should return given value", () => {
    const actual = validateString("test", { message, required: true });
    actual.should.equal("test");
  });

  it("validateString() should return defaultValue", () => {
    const actual = validateString(undefined, {
      message,
      required: true,
      defaultValue: "test"
    });
    actual.should.equal("test");
  });

  it("validateString() should throw", () => {
    utils.shouldThrow(
      () => validateString(true, { message, required: true }),
      "Must be type string but is boolean."
    );
  });

  it("validateString() should return trimmed value", () => {
    const actual = validateString(" test  ", {
      trim: true
    });
    actual.should.equal("test");
  });

  it("validateString() empty string should throw", () => {
    utils.shouldThrow(
      () => validateString("", { message, empty: false }),
      "String is empty."
    );
  });

  it("validateString() empty string should verify", () => {
    const actual = validateString("", {});
    actual.should.equal("");
  });

  it("validateString() min length should throw", () => {
    utils.shouldThrow(
      () => validateString("te", { message, min: 3 }),
      "Must have at least 3 characters."
    );
  });

  it("validateString() min length should verify", () => {
    const actual = validateString("test", { min: 3 });
    actual.should.equal("test");
  });

  it("validateString() max length should throw", () => {
    utils.shouldThrow(
      () => validateString("test", { message, max: 3 }),
      "Must have at most 3 characters."
    );
  });

  it("validateString() max length should verify", () => {
    const actual = validateString("te", { max: 3 });
    actual.should.equal("te");
  });

  it("validateString() length should throw", () => {
    utils.shouldThrow(
      () => validateString("te", { message, length: 3 }),
      "Must have exactly 3 characters."
    );
  });

  it("validateString() length length should verify", () => {
    const actual = validateString("test", { length: 4 });
    actual.should.equal("test");
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
