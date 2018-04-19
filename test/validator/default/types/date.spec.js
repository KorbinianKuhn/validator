const {
  DateFactory,
  toMoment
} = require("./../../../../src/validator/default/types/date");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");
const moment = require("moment");

describe("validator/default/types/date", () => {
  const message = Message("en");

  it("DateFactory() should return DATE object", () => {
    DateFactory({ message }, {}).constructor.name.should.equal("DATE");
  });

  it("options() should return options", () => {
    const func = () => {};
    const defaultValue = "2018-01-01T00:00:00.000Z";
    const allowed = [null];
    const not = ["not"];
    const only = ["only"];
    const parse = false;
    const description = "description";
    const example = "example";
    const format = "YYYY-MM-DD[T]HH:mm:ss.SSSZ";
    const strict = true;
    const utc = true;
    const min = "2018-01-01T00:00:00.000Z";
    const max = "2019-01-01T00:00:00.000Z";

    const schema = DateFactory({ message }, {})
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
      .format(format)
      .strict(strict)
      .utc(utc)
      .min(min)
      .max(max);

    schema.options({ validation: true }).should.deepEqual({
      defaultValue,
      allowed,
      func,
      not,
      only,
      parse,
      required: false,
      message,
      format,
      strict,
      utc,
      min,
      max
    });

    schema.options().should.deepEqual({
      type: "date",
      description,
      example,
      default: defaultValue,
      allowed,
      not,
      only,
      parse,
      required: false,
      format,
      strict,
      utc,
      min,
      max
    });
  });

  it("func() with invalid argument should fail", () => {
    utils.shouldThrow(
      () => DateFactory({ message }, {}).func("wrong"),
      "Validator configuration error: Must be a function."
    );
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = DateFactory({ message }, {})
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: "date",
      description,
      example,
      required: true,
      parse: false,
      strict: false,
      utc: false,
      format: "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
    });
  });

  it("validateSync() should verify", () => {
    DateFactory({ message }, {})
      .validateSync("2018-01-01T00:00:00.000Z")
      .should.equal("2018-01-01T00:00:00.000Z");
  });

  it("validateSync() should fail", () => {
    utils.shouldThrow(
      () =>
        DateFactory({ message }, {})
          .required()
          .validateSync(undefined),
      "Required but is undefined."
    );
  });

  it("validateAsync() should verify", async () => {
    await DateFactory({ message }, {})
      .validate("2018-01-01T00:00:00.000Z")
      .then(value => {
        value.should.equal("2018-01-01T00:00:00.000Z");
      });
  });

  it("validateAsync() should fail", async () => {
    await utils.shouldEventuallyThrow(
      DateFactory({ message }, {})
        .required()
        .validate(undefined),
      "Required but is undefined."
    );
  });

  it("toMoment() should return date", () => {
    const date = "2018-01-01T00:00:00.000Z";
    const actual = toMoment(message, date);
    const expected = moment(date);
    actual.should.deepEqual(expected);
  });

  it("toMoment() should return date", () => {
    const date = "2018-01-01T00:00:00.000Z";
    const actual = toMoment(message, date, true);
    const expected = moment.utc(date);
    actual.should.deepEqual(expected);
  });

  it("toMoment() should fail", () => {
    const date = "2018";
    const format = "YYYY-MM-DD";
    utils.shouldThrow(
      () => toMoment(message, date, false, format, true),
      "Validator configuration error: Must be a valid date with the format YYYY-MM-DD."
    );
  });
});
