const {
  ObjectFactory
} = require("./../../../../src/validator/default/types/object");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/object", () => {
  const message = Message("en");

  it("ObjectFactory() should return OBJECT object", () => {
    ObjectFactory(undefined, { message }, {}).constructor.name.should.equal(
      "OBJECT"
    );
  });

  it("ObjectFactory() should with invalid object should throw", () => {
    utils.shouldThrow(
      () => ObjectFactory("wrong", { message }, {}),
      "Validator configuration error: Must be an object."
    );
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = ["test"];
    const allowed = [null];
    const not = ["not"];
    const only = ["only"];
    const parse = false;
    const description = "description";
    const example = "example";
    const min = 1;
    const max = 3;
    const length = 2;
    const empty = false;
    const object = {};
    const unknown = true;

    const schema = ObjectFactory(object, { message }, {})
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .func(func, "test")
      .min(min)
      .max(max)
      .length(length)
      .empty(empty)
      .unknown(unknown);

    schema.options({ validation: true }).should.deepEqual({
      defaultValue,
      allowed,
      func: {
        fn: func,
        keys: ["test"]
      },
      not,
      only,
      parse,
      required: false,
      message,
      min,
      max,
      length,
      empty,
      object,
      unknown,
      conditions: []
    });

    schema.options().should.deepEqual({
      type: "object",
      description,
      example,
      default: defaultValue,
      allowed,
      not,
      only,
      parse,
      required: false,
      min,
      max,
      length,
      empty,
      unknown
    });
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = ObjectFactory(undefined, { message }, {})
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: "object",
      description,
      example,
      required: true,
      empty: true,
      parse: false,
      unknown: true,
      properties: {}
    });
  });

  it("validateSync() should verify", () => {
    ObjectFactory(undefined, { message }, {})
      .validateSync({})
      .should.deepEqual({});
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        ObjectFactory(undefined, { message }, {})
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await ObjectFactory(undefined, { message }, {})
      .validate({})
      .then(value => {
        value.should.deepEqual({});
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      ObjectFactory(undefined, { message }, {})
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });

  it("func() with invalid type should throw", () => {
    utils.shouldThrow(
      () => ObjectFactory({}, { message }, {}).func("wrong"),
      "Validator configuration error: Must be a function."
    );
  });

  it("conditions should get added", () => {
    const schema = ObjectFactory({}, { message }, {})
      .gt("a", "b")
      .gte("a", "b")
      .lt("a", "b")
      .lte("a", "b")
      .equals("a", "b")
      .notEquals("a", "b")
      .dependsOn("a", "b")
      .xor("a", "b")
      .or("a", "b");
    schema._conditions.should.deepEqual([
      { keyA: "a", keyB: "b", method: "gt" },
      { keyA: "a", keyB: "b", method: "gte" },
      { keyA: "a", keyB: "b", method: "lt" },
      { keyA: "a", keyB: "b", method: "lte" },
      { keyA: "a", keyB: "b", method: "equals" },
      { keyA: "a", keyB: "b", method: "notEquals" },
      { keyA: "a", keyB: "b", method: "dependsOn" },
      { keyA: "a", keyB: "b", method: "xor" },
      { keyA: "a", keyB: "b", method: "or" }
    ]);
  });
});
