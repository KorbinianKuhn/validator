const {
  ArrayFactory
} = require("./../../../../src/validator/default/types/array");
const {
  StringFactory
} = require("./../../../../src/validator/default/types/string");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/array", () => {
  const message = Message("en");

  it("ArrayFactory() should return ARRAY object", () => {
    ArrayFactory().constructor.name.should.equal("ARRAY");
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
    const unique = true;

    const schema = ArrayFactory()
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .func(func)
      .min(min)
      .max(max)
      .length(length)
      .unique(unique)
      .empty(empty);

    schema.options({ validation: true }).should.deepEqual({
      defaultValue,
      allowed,
      func,
      not,
      only,
      parse,
      required: false,
      message,
      min,
      max,
      length,
      empty,
      unique
    });

    schema.options().should.deepEqual({
      type: "array",
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
      unique
    });
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = ArrayFactory()
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: "array",
      description,
      example,
      required: true,
      empty: true,
      parse: false
    });
  });

  it("toObject() should return object with items", () => {
    const itemSchema = StringFactory();

    const schema = ArrayFactory(itemSchema);

    schema.toObject().should.deepEqual({
      type: "array",
      required: false,
      empty: true,
      parse: false,
      items: itemSchema.toObject(),
      example: ["No example provided"]
    });
  });

  it("validateSync() should verify", () => {
    ArrayFactory()
      .validateSync(["test"])
      .should.deepEqual(["test"]);
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        ArrayFactory()
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await ArrayFactory()
      .validate(["test"])
      .then(value => {
        value.should.deepEqual(["test"]);
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      ArrayFactory()
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });

  it("example() with no type should return empty array", () => {
    ArrayFactory()
      .example()
      .should.deepEqual("No example provided");
  });
});
