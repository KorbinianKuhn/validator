const {
  BooleanFactory
} = require("./../../../../src/validator/default/types/boolean");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/boolean", () => {
  const message = Message("en");

  it("BooleanFactory() should return BOOLEAN object", () => {
    BooleanFactory({ message }, {}).constructor.name.should.equal("BOOLEAN");
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = true;
    const not = ["not"];
    const only = ["only"];
    const parse = false;
    const description = "description";
    const example = "example";

    const schema = BooleanFactory({ message }, {})
      .description(description)
      .example(example)
      .default(defaultValue)
      .not(not)
      .only(only)
      .parse(parse)
      .required()
      .optional()
      .func(func);

    schema.options({ validation: true }).should.deepEqual({
      defaultValue,
      func,
      not,
      only,
      parse,
      required: false,
      message
    });

    schema.options().should.deepEqual({
      type: "boolean",
      description,
      example,
      default: defaultValue,
      not,
      only,
      parse,
      required: false
    });
  });

  it("default() invalid default value should throw", () => {
    utils.shouldThrow(
      () => BooleanFactory({ message }, {}).default("wrong"),
      "Validator configuration error: Default value must be type boolean but is string."
    );
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = BooleanFactory({ message }, {})
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: "boolean",
      description,
      example,
      required: true,
      parse: false
    });
  });

  it("validateSync() should verify", () => {
    BooleanFactory({ message }, {})
      .validateSync(true)
      .should.equal(true);
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        BooleanFactory({ message }, {})
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await BooleanFactory({ message }, {})
      .validate(false)
      .then(value => {
        value.should.equal(false);
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      BooleanFactory({ message }, {})
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });
});
