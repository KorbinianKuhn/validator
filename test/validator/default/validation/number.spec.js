const {
  validateNumber,
  validateSync,
  validate
} = require("./../../../../src/validator/default/validation/number");
const { Message } = require("./../../../../src/utils/message");
const helper = require("./../../../helper");
const should = require("should");

describe("validator/default/validation/number", () => {
  const message = Message("en");

  it("validateNumber() should return given value", () => {
    const actual = validateNumber(2.4, { message, required: true });
    actual.should.equal(2.4);
  });

  it("validateNumber() should return defaultValue", () => {
    const actual = validateNumber(undefined, {
      message,
      required: true,
      defaultValue: 2
    });
    actual.should.equal(2);
  });

  it("validateNumber() with null should verify", () => {
    const actual = validateNumber(null, {
      allowed: [null]
    });
    should.equal(actual, null);
  });

  it("validateNumber() with null should throw", () => {
    helper.shouldThrow(
      () =>
        validateNumber(null, {
          message,
          required: true,
          allowed: []
        }),
      "Required but is null."
    );
  });

  it("validateNumber() should throw", () => {
    helper.shouldThrow(
      () => validateNumber("wrong", { message, required: true }),
      "Must be a number."
    );
  });

  it("validateNumber() should parse to number", () => {
    let actual = validateNumber("2.2", {
      message,
      required: true,
      parse: true
    });
    actual.should.equal(2.2);
  });

  it("validateNumber() should parse to integer", () => {
    let actual = validateNumber("2", {
      message,
      required: true,
      parse: true,
      integer: true
    });
    actual.should.equal(2);
  });

  it("validateNumber() should not parse to integer", () => {
    helper.shouldThrow(
      () =>
        validateNumber("2.2", {
          message,
          required: true,
          parse: true,
          integer: true
        }),
      "No decimal places allowed."
    );
  });

  it("validateNumber() should try parse to number but fail", () => {
    helper.shouldThrow(
      () => validateNumber("wrong", { message, required: true, parse: true }),
      "Must be a number."
    );
  });

  it("validateNumber() number for integer should fail", () => {
    helper.shouldThrow(
      () => validateNumber(2.2, { message, required: true, integer: true }),
      "No decimal places allowed."
    );
  });

  it("validateNumber() string for integer should fail", () => {
    helper.shouldThrow(
      () => validateNumber("2.2", { message, required: true, integer: true }),
      "Must be an integer."
    );
  });

  it("validateNumber() min should fail", () => {
    helper.shouldThrow(
      () => validateNumber(1.2, { message, min: 2 }),
      "Must be at minimum 2."
    );

    helper.shouldThrow(
      () => validateNumber(1, { message, min: 2, integer: true }),
      "Must be at minimum 2."
    );
  });

  it("validateNumber() min should verify", () => {
    let actual = validateNumber(2.2, { message, min: 2 });
    actual.should.equal(2.2);

    actual = validateNumber(3, { message, min: 2, integer: true });
    actual.should.equal(3);
  });

  it("validateNumber() max should fail", () => {
    helper.shouldThrow(
      () => validateNumber(3.2, { message, max: 2 }),
      "Must be at maximum 2."
    );

    helper.shouldThrow(
      () => validateNumber(3, { message, max: 2, integer: true }),
      "Must be at maximum 2."
    );
  });

  it("validateNumber() max should verify", () => {
    let actual = validateNumber(1.2, { message, max: 2 });
    actual.should.equal(1.2);

    actual = validateNumber(1, { message, max: 2, integer: true });
    actual.should.equal(1);
  });

  it("validateNumber() less should fail", () => {
    helper.shouldThrow(
      () => validateNumber(3.2, { message, less: 2 }),
      "Must be less than 2."
    );

    helper.shouldThrow(
      () => validateNumber(3, { message, less: 2, integer: true }),
      "Must be less than 2."
    );
  });

  it("validateNumber() less should verify", () => {
    let actual = validateNumber(1.2, { message, less: 2 });
    actual.should.equal(1.2);

    actual = validateNumber(1, { message, less: 2, integer: true });
    actual.should.equal(1);
  });

  it("validateNumber() greater should fail", () => {
    helper.shouldThrow(
      () => validateNumber(1.2, { message, greater: 2 }),
      "Must be greater than 2."
    );

    helper.shouldThrow(
      () => validateNumber(1, { message, greater: 2, integer: true }),
      "Must be greater than 2."
    );
  });

  it("validateNumber() greater should verify", () => {
    let actual = validateNumber(2.2, { message, greater: 2 });
    actual.should.equal(2.2);

    actual = validateNumber(3, { message, greater: 2, integer: true });
    actual.should.equal(3);
  });

  it("validateNumber() positive should fail", () => {
    helper.shouldThrow(
      () => validateNumber(-1.3, { message, positive: true }),
      "Must be a positive number."
    );

    helper.shouldThrow(
      () => validateNumber(0, { message, positive: true, integer: true }),
      "Must be a positive number."
    );
  });

  it("validateNumber() positive should verify", () => {
    let actual = validateNumber(1.2, { message, positive: true });
    actual.should.equal(1.2);

    actual = validateNumber(3, { message, positive: true, integer: true });
    actual.should.equal(3);
  });

  it("validateNumber() negative should fail", () => {
    helper.shouldThrow(
      () => validateNumber(1.3, { message, negative: true }),
      "Must be a negative number."
    );

    helper.shouldThrow(
      () => validateNumber(0, { message, negative: true, integer: true }),
      "Must be a negative number."
    );
  });

  it("validateNumber() negative should verify", () => {
    let actual = validateNumber(-1.2, { message, negative: true });
    actual.should.equal(-1.2);

    actual = validateNumber(-3, { message, negative: true, integer: true });
    actual.should.equal(-3);
  });

  it("validateSync() should return given value", () => {
    const actual = validateSync(2, {});
    actual.should.equal(2);
  });

  it("validate() should return given value", async () => {
    const actual = await validate(2.5812, {});
    actual.should.equal(2.5812);
  });
});
