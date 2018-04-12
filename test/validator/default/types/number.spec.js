const {
  NumberFactory
} = require("./../../../../src/validator/default/types/number");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");

describe("validator/default/types/number", () => {
  const message = Message("en");

  it("NumberFactory() should return NUMBER object", () => {
    NumberFactory({ message }, {}).constructor.name.should.equal("NUMBER");
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = 2;
    const not = [0];
    const only = [2];
    const parse = false;
    const description = "description";
    const example = "example";
    const min = 1;
    const max = 3;
    const less = 4;
    const greater = 0;
    const positive = true;
    const negative = true;

    const schema = NumberFactory({ message }, {})
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
      .less(less)
      .greater(greater)
      .positive(positive)
      .negative(negative);

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
      less,
      greater,
      negative,
      positive,
      integer: false
    });

    schema.options().should.deepEqual({
      type: "number",
      description,
      example,
      default: defaultValue,
      not,
      only,
      parse,
      required: false,
      min,
      max,
      less,
      greater,
      negative,
      positive,
      integer: false
    });
  });

  it("default() invalid default value should throw", () => {
    utils.shouldThrow(
      () => NumberFactory({ message }, {}).default(true),
      "Validator configuration error: Default value must be type number but is boolean."
    );
  });

  it("default() invalid default value for integer should throw", () => {
    utils.shouldThrow(
      () =>
        NumberFactory({ message }, {})
          .integer()
          .default(2.2),
      "Validator configuration error: Default value must be type integer but is number."
    );
  });

  it("default() default value for integer should verify", () => {
    NumberFactory({ message }, {})
      .integer()
      .default(1);
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = NumberFactory({ message }, {})
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: "number",
      description,
      example,
      required: true,
      parse: false,
      integer: false
    });
  });

  it("validateSync() should verify", () => {
    NumberFactory({ message }, {})
      .validateSync(2)
      .should.equal(2);
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        NumberFactory({ message }, {})
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await NumberFactory({ message }, {})
      .validate(2)
      .then(value => {
        value.should.equal(2);
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      NumberFactory({ message }, {})
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });
});
