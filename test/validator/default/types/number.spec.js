const {
  NumberFactory
} = require("./../../../../src/validator/default/types/number");
const { Message } = require("./../../../../src/utils/message");
const helper = require("./../../../helper");

describe("validator/default/types/number", () => {
  const message = Message("en");

  it("NumberFactory() should return NUMBER object", () => {
    NumberFactory().constructor.name.should.equal("NUMBER");
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = 2;
    const allowed = [null];
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

    const schema = NumberFactory()
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .integer()
      .func(func)
      .min(min)
      .max(max)
      .less(less)
      .greater(greater)
      .positive(positive)
      .negative(negative);

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
      less,
      greater,
      negative,
      positive,
      integer: true
    });

    schema.options().should.deepEqual({
      type: "number",
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
      less,
      greater,
      negative,
      positive,
      integer: true
    });
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = NumberFactory()
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
    NumberFactory()
      .validateSync(2)
      .should.equal(2);
  });

  it("validateSync() should fail", () => {
    helper.shouldThrow(
      () =>
        NumberFactory()
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await NumberFactory()
      .validate(2)
      .then(value => {
        value.should.equal(2);
      });
  });

  it("validateAsync() should fail", async () => {
    await helper.shouldEventuallyThrow(
      NumberFactory()
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });
});
