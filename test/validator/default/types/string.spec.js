const {
  StringFactory
} = require("./../../../../src/validator/default/types/string");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/string", () => {
  const message = Message("en");

  it("StringFactory() should return STRING object", () => {
    StringFactory({ message }, {}).constructor.name.should.equal("STRING");
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = "test";
    const allowed = [null];
    const not = ["not"];
    const only = ["only"];
    const parse = false;
    const description = "description";
    const example = "example";
    const min = 1;
    const max = 3;
    const length = 2;
    const trim = true;
    const pattern = /A-Z/;
    const empty = false;
    const locales = { key: "value" };

    const schema = StringFactory({ message }, {})
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
      .trim(trim)
      .regex(pattern, locales)
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
      trim,
      regex: {
        pattern,
        locales
      },
      empty
    });

    schema.options().should.deepEqual({
      type: "string",
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
      trim,
      pattern,
      empty
    });
  });

  it("regex() invalid regex should throw", () => {
    utils.shouldThrow(
      () => StringFactory({ message }, {}).regex(true),
      "Validator configuration error: Must be a regular expression."
    );
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = StringFactory({ message }, {})
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: "string",
      description,
      example,
      required: true,
      empty: true,
      trim: false,
      parse: false
    });
  });

  it("validateSync() should verify", () => {
    StringFactory({ message }, {})
      .validateSync("test")
      .should.equal("test");
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        StringFactory({ message }, {})
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await StringFactory({ message }, {})
      .validate("test")
      .then(value => {
        value.should.equal("test");
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      StringFactory({ message }, {})
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });
});
