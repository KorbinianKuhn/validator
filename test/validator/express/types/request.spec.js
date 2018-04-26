const {
  RequestFactory,
  toSchema
} = require("./../../../../src/validator/express/types/request");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");
const {
  ExpressValidatorFactory
} = require("./../../../../src/validator/express/validator");

describe("validator/express/types/request", () => {
  const message = Message("en");
  const validator = ExpressValidatorFactory();

  it("RequestFactory() should return REQUEST object", () => {
    RequestFactory().constructor.name.should.equal("REQUEST");
  });

  it("options() should return options", () => {
    const description = "description";
    const example = "example";
    const params = validator.Params({});
    const query = validator.Query({});
    const body = validator.Body({});

    const schema = RequestFactory()
      .description(description)
      .example(example)
      .params(params)
      .query(query)
      .body(body);

    schema.options({ validation: true }).should.deepEqual({
      unknown: true,
      message,
      params,
      query,
      body
    });

    schema.options().should.deepEqual({
      type: "request",
      description,
      example,
      unknown: true
    });
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";

    const schema = RequestFactory()
      .description(description)
      .example(example);

    schema.toObject().should.deepEqual({
      type: "request",
      description,
      example,
      unknown: true
    });
  });

  it("validateSync() should verify", () => {
    const req = { params: {}, query: {}, body: {} };
    RequestFactory()
      .validateSync(req)
      .should.equal(req);
  });

  it("validateSync() should fail", () => {
    const req = { params: {}, query: {}, body: {} };
    utils.shouldThrow(
      () =>
        RequestFactory({ message, requiredAsDefault: true }, {})
          .params({ name: validator.String() })
          .validateSync(req),
      {
        params: { name: "Required but is undefined." }
      }
    );
  });

  it("validateAsync() should verify", async () => {
    const req = { params: {}, query: {}, body: {} };
    await RequestFactory()
      .validate(req)
      .then(value => {
        value.should.equal(req);
      });
  });

  it("validateAsync() should fail", async () => {
    const req = { params: {}, query: {}, body: {} };
    await utils.shouldEventuallyThrow(
      RequestFactory({ message, requiredAsDefault: true }, {})
        .params({ name: validator.String() })
        .validate(req),
      {
        params: { name: "Required but is undefined." }
      }
    );
  });

  it("toSchema() no object should fail", () => {
    utils.shouldThrow(
      () => toSchema(undefined, {}, {}, message),
      "Validator configuration error: Invalid schema."
    );
  });

  it("toSchema() invalid object should fail", () => {
    utils.shouldThrow(
      () => toSchema([], {}, {}, message),
      "Validator configuration error: Must be object or array schema."
    );
  });

  it("toSchema() plain object should verify", () => {
    const schema = toSchema({}, {}, {}, message);
    schema.constructor.name.should.equal("OBJECT");
  });

  it("toSchema() should return givenschema", () => {
    const expected = validator.Object({});
    const actual = toSchema(expected, {}, {}, message);
    actual.should.equal(expected);
  });
});
