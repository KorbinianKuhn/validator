const {
  ArrayFactory
} = require("./../../../../src/validator/default/types/array");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/array", () => {
  const message = Message("en");

  it("ArrayFactory() should return ARRAY object", () => {
    ArrayFactory(undefined, { message }, {}).constructor.name.should.equal(
      "ARRAY"
    );
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = ["test"];
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

    const schema = ArrayFactory(undefined, { message }, {})
      .description(description)
      .example(example)
      .default(defaultValue)
      .not(not)
      .only(only)
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
      itemSchema: undefined,
      unique
    });

    schema.options().should.deepEqual({
      type: "array",
      description,
      example,
      default: defaultValue,
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

  it("default() invalid default value should throw", () => {
    utils.shouldThrow(
      () => ArrayFactory(undefined, { message }, {}).default(true),
      "Validator configuration error: Default value must be type array but is boolean."
    );
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = ArrayFactory(undefined, { message }, {})
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

  it("validateSync() should verify", () => {
    ArrayFactory(undefined, { message }, {})
      .validateSync(["test"])
      .should.deepEqual(["test"]);
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        ArrayFactory(undefined, { message }, {})
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await ArrayFactory(undefined, { message }, {})
      .validate(["test"])
      .then(value => {
        value.should.deepEqual(["test"]);
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      ArrayFactory(undefined, { message }, {})
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });
});
