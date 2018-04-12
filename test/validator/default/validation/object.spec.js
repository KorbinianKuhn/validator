const {
  validateObjectBeforeProperties,
  validateObjectPropertiesSync,
  validateObjectPropertiesAsync,
  validateObjectAfterProperties,
  validateCondition,
  validateObjectConditions,
  validateObjectFunctionSync,
  validateObjectFunctionAsync,
  validateSync,
  validate
} = require("./../../../../src/validator/default/validation/object");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");
const {
  StringFactory
} = require("./../../../../src/validator/default/types/string");

describe("validator/default/validation/object", () => {
  const message = Message("en");

  it("validateObjectBeforeProperties() should return given value", () => {
    const actual = validateObjectBeforeProperties(
      {},
      { message, required: true }
    );
    actual.should.deepEqual({});
  });

  it("validateObjectBeforeProperties() should return defaultValue", () => {
    const actual = validateObjectBeforeProperties(undefined, {
      message,
      required: true,
      defaultValue: {}
    });
    actual.should.deepEqual({});
  });

  it("validateObjectBeforeProperties() should throw", () => {
    utils.shouldThrow(
      () =>
        validateObjectBeforeProperties("wrong", { message, required: true }),
      "Must be type object but is string."
    );
  });

  it("validateObjectBeforeProperties() should parse to object", () => {
    let actual = validateObjectBeforeProperties("{}", {
      parse: true
    });
    actual.should.deepEqual({});
  });

  it("validateObjectBeforeProperties() should try parse to object but fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectBeforeProperties("wrong", {
          message,
          parse: true
        }),
      "Must be type object but is string."
    );
  });

  it("validateObjectBeforeProperties() empty object should verify", () => {
    let actual = validateObjectBeforeProperties(
      {},
      {
        empty: true
      }
    );
    actual.should.deepEqual({});
  });

  it("validateObjectBeforeProperties() empty object should fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          {},
          {
            message,
            empty: false
          }
        ),
      "Object is empty."
    );
  });

  it("validateObjectBeforeProperties() length should verify", () => {
    let actual = validateObjectBeforeProperties(
      { key: "value" },
      {
        length: 1
      }
    );
    actual.should.deepEqual({ key: "value" });
  });

  it("validateObjectBeforeProperties() min length should fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          {},
          {
            message,
            min: 1
          }
        ),
      "Must have at least 1 keys."
    );
  });

  it("validateObjectBeforeProperties() min length should verify", () => {
    let actual = validateObjectBeforeProperties(
      { key: "value" },
      {
        min: 1
      }
    );
    actual.should.deepEqual({ key: "value" });
  });

  it("validateObjectBeforeProperties() max length should fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          { key: "value", invalid: "value" },
          {
            message,
            max: 1
          }
        ),
      "Must have at most 1 keys."
    );
  });

  it("validateObjectBeforeProperties() max length should verify", () => {
    let actual = validateObjectBeforeProperties(
      { key: "value" },
      {
        max: 1
      }
    );
    actual.should.deepEqual({ key: "value" });
  });

  it("validateObjectBeforeProperties() length should fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          {},
          {
            message,
            length: 1
          }
        ),
      "Must have exactly 1 keys."
    );
  });

  it("validateObjectPropertiesSync() should verify", () => {
    const schema = StringFactory({}, { message });
    const actual = validateObjectPropertiesSync(
      { key: "test" },
      { key: schema }
    );
    actual.should.deepEqual({ key: "test" });
  });

  it("validateObjectPropertiesSync() should fail", () => {
    const schema = StringFactory({}, { message });
    utils.shouldThrow(() => validateObjectPropertiesSync({}, { key: schema }), {
      key: "Must be type string but is undefined."
    });
  });

  it("validateObjectPropertiesAsync() should verify", async () => {
    const schema = StringFactory({}, { message });
    const actual = await validateObjectPropertiesAsync(
      { key: "test" },
      { key: schema }
    );
    actual.should.deepEqual({ key: "test" });
  });

  it("validateObjectPropertiesAsync() should fail", async () => {
    const schema = StringFactory({}, { message });
    await utils.shouldEventuallyThrow(
      validateObjectPropertiesAsync({}, { key: schema }),
      {
        key: "Must be type string but is undefined."
      }
    );
  });

  it("validateObjectAfterProperties() should verify", () => {
    validateObjectAfterProperties({}, {});
  });

  it("validateObjectAfterProperties() with unknown key should fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectAfterProperties(
          { key: "value" },
          { message, unknown: false, object: {} }
        ),
      { key: "Unknown key." }
    );
  });

  it("validateObjectAfterProperties() with keys should verify", () => {
    const schema = StringFactory({}, { message });
    validateObjectAfterProperties(
      { key: "value" },
      { unknown: false, object: { key: schema } }
    );
  });

  it("validateObjectAfterProperties() with conditions should verify", () => {
    validateObjectAfterProperties({}, { conditions: [] });
  });

  it("validateCondition() gt should verify", () => {
    validateCondition(message, "gt", "a", "b", 2, 1);
    validateCondition(message, "gt", "a", "b", {}, {});
  });

  it("validateCondition() gt should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "gt", "a", "b", 1, 2),
      "Must be greater than b."
    );
  });

  it("validateCondition() gte should verify", () => {
    validateCondition(message, "gte", "a", "b", 2, 1);
    validateCondition(message, "gte", "a", "b", {}, {});
  });

  it("validateCondition() gte should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "gte", "a", "b", 1, 2),
      "Must be greater than or equal b."
    );
  });

  it("validateCondition() lt should verify", () => {
    validateCondition(message, "lt", "a", "b", 1, 2);
    validateCondition(message, "lt", "a", "b", {}, {});
  });

  it("validateCondition() lt should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "lt", "a", "b", 2, 1),
      "Must be less than b."
    );
  });

  it("validateCondition() lte should verify", () => {
    validateCondition(message, "lte", "a", "b", 1, 2);
    validateCondition(message, "lte", "a", "b", {}, {});
  });

  it("validateCondition() lte should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "lte", "a", "b", 2, 1),
      "Must be less than or equal b."
    );
  });

  it("validateCondition() equals should verify", () => {
    validateCondition(message, "equals", "a", "b", 2, 2);
  });

  it("validateCondition() equals should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "equals", "a", "b", 2, 1),
      "Must equal b."
    );
  });

  it("validateCondition() notEquals should verify", () => {
    validateCondition(message, "notEquals", "a", "b", 1, 2);
  });

  it("validateCondition() notEquals should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "notEquals", "a", "b", 2, 2),
      "Must not equal b."
    );
  });

  it("validateCondition() xor should verify", () => {
    validateCondition(message, "xor", "a", "b", 1, undefined);
  });

  it("validateCondition() xor should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "xor", "a", "b", 1, 2),
      "Either a or b must be set."
    );

    utils.shouldThrow(
      () => validateCondition(message, "xor", "a", "b", undefined, undefined),
      "Either a or b must be set."
    );
  });

  it("validateCondition() or should verify", () => {
    validateCondition(message, "or", "a", "b", 1, undefined);
    validateCondition(message, "or", "a", "b", undefined, 1);
  });

  it("validateCondition() or should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "or", "a", "b", 1, 2),
      "Either a or b can be set."
    );
  });

  it("validateCondition() dependsOn should verify", () => {
    validateCondition(message, "dependsOn", "a", "b", 1, 2);
  });

  it("validateCondition() dependsOn should fail", () => {
    utils.shouldThrow(
      () => validateCondition(message, "dependsOn", "a", "b", 1, undefined),
      "Depends on b."
    );
  });

  it("validateObjectConditions() with no conditions should verify", () => {
    validateObjectConditions(message, {}, []);
  });

  it("validateObjectConditions() with conditions should verify", () => {
    validateObjectConditions(message, { a: 1, b: 2 }, [
      {
        keyA: "a",
        keyB: "b",
        method: "lt"
      }
    ]);
  });

  it("validateObjectConditions() with conditions should fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectConditions(message, { a: 3, b: 2 }, [
          {
            keyA: "a",
            keyB: "b",
            method: "lt"
          }
        ]),
      {
        a: "Must be less than b."
      }
    );
  });

  it("validateObjectConditions() with multiple failing conditions should fail", () => {
    utils.shouldThrow(
      () =>
        validateObjectConditions(message, { a: 3, b: 2 }, [
          {
            keyA: "a",
            keyB: "b",
            method: "lt"
          },
          {
            keyA: "a",
            keyB: "b",
            method: "xor"
          }
        ]),
      {
        a: "Must be less than b. Either a or b must be set."
      }
    );
  });

  it("validateObjectFunctionSync() without function should verify", () => {
    validateObjectFunctionSync({}, undefined);
  });

  it("validateObjectFunctionSync() should verify", () => {
    const func = {
      fn: value => value,
      keys: ["a"]
    };
    validateObjectFunctionSync({}, func);
  });

  it("validateObjectFunctionSync() should fail", () => {
    const func = {
      fn: () => {
        throw new Error("test");
      },
      keys: ["a", "b"]
    };
    utils.shouldThrow(() => validateObjectFunctionSync({}, func), {
      "[a, b]": "test"
    });
  });

  it("validateObjectFunctionAsync() without function should verify", async () => {
    await validateObjectFunctionAsync({}, undefined);
  });

  it("validateObjectFunctionAsync() should verify", async () => {
    const func = {
      fn: value => value,
      keys: ["a"]
    };
    await validateObjectFunctionAsync({}, func);
  });

  it("validateObjectFunctionAsync() should fail", async () => {
    const func = {
      fn: () => {
        throw new Error("test");
      },
      keys: ["a", "b"]
    };
    await utils.shouldEventuallyThrow(validateObjectFunctionAsync({}, func), {
      "[a, b]": "test"
    });
  });

  it("validateObjectFunctionAsync() with Async function should fail", async () => {
    const func = {
      fn: async () => {
        throw new Error("test");
      },
      keys: ["a", "b"]
    };
    await utils.shouldEventuallyThrow(validateObjectFunctionAsync({}, func), {
      "[a, b]": "test"
    });
  });

  it("validateSync() should return given value", () => {
    const actual = validateSync({}, {});
    actual.should.deepEqual({});
  });

  it("validate() should return given value", async () => {
    const actual = await validate({}, {});
    actual.should.deepEqual({});
  });
});
