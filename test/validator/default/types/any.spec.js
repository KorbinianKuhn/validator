const { AnyFactory } = require("./../../../../src/validator/default/types/any");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/any", () => {
  const message = Message("en");

  it("AnyFactory() should return ANY object", () => {
    AnyFactory({ message }, {}).constructor.name.should.equal("ANY");
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = "default";
    const allowed = [null];
    const not = ["not"];
    const only = ["only"];
    const parse = false;
    const description = "description";
    const example = "example";

    const schema = AnyFactory({ message }, {})
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .func(func);

    schema.options({ validation: true }).should.deepEqual({
      defaultValue,
      allowed,
      func,
      not,
      only,
      parse,
      required: false,
      message
    });

    schema.options().should.deepEqual({
      type: "any",
      description,
      example,
      default: defaultValue,
      allowed,
      not,
      only,
      parse,
      required: false
    });
  });

  it("func() with invalid argument should fail", () => {
    utils.shouldThrow(
      () => AnyFactory({ message }, {}).func("wrong"),
      "Validator configuration error: Must be a function."
    );
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = AnyFactory({ message }, {})
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: "any",
      description,
      example,
      required: true,
      parse: false
    });
  });

  it("validateSync() should verify", () => {
    AnyFactory({ message }, {})
      .validateSync("test")
      .should.equal("test");
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        AnyFactory({ message }, {})
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await AnyFactory({ message }, {})
      .validate("test")
      .then(value => {
        value.should.equal("test");
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      AnyFactory({ message }, {})
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });
});
