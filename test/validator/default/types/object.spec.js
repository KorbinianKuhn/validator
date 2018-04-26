const {
  ObjectFactory
} = require("./../../../../src/validator/default/types/object");
const {
  StringFactory
} = require("./../../../../src/validator/default/types/string");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/object", () => {
  const message = Message("en");

  it("ObjectFactory() should return OBJECT object", () => {
    ObjectFactory().constructor.name.should.equal("OBJECT");
  });

  it("ObjectFactory() should with invalid object should throw", () => {
    utils.shouldThrow(
      () => ObjectFactory("wrong"),
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

    const schema = ObjectFactory(object)
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
    const name = StringFactory();

    const schema = ObjectFactory({ name })
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
      properties: {
        name: name.toObject()
      }
    });
  });

  it("validateSync() should verify", () => {
    ObjectFactory()
      .validateSync({})
      .should.deepEqual({});
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        ObjectFactory()
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await ObjectFactory()
      .validate({})
      .then(value => {
        value.should.deepEqual({});
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      ObjectFactory()
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });

  it("func() with invalid type should throw", () => {
    utils.shouldThrow(
      () => ObjectFactory({}).func("wrong"),
      "Validator configuration error: Must be a function."
    );
  });

  it("conditions should get added", () => {
    const schema = ObjectFactory({})
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

  it("example() should return generated example", () => {
    const schema = ObjectFactory({ name: StringFactory().example("Jane Doe") });
    schema.example().should.deepEqual({ name: "Jane Doe" });
  });

  it("example() should return generated example", () => {
    const schema = ObjectFactory({ name: StringFactory() });
    schema.example().should.deepEqual({ name: "No example provided" });
  });

  it("example() should return set example", () => {
    const schema = ObjectFactory({
      name: StringFactory().example("Jane Doe")
    }).example({ name: "John Doe" });
    schema.example().should.deepEqual({ name: "John Doe" });
  });
});
