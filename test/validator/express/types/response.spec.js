const {
  ResponseFactory
} = require("./../../../../src/validator/express/types/response");
const { Message } = require("./../../../../src/utils/message");
const utils = require("./../../../utils");
const {
  ExpressValidatorFactory
} = require("./../../../../src/validator/express/validator");

describe("validator/express/types/response", () => {
  const message = Message("en");
  const validator = ExpressValidatorFactory();

  it("ResponseFactory() should return RESPONSE object", () => {
    ResponseFactory(validator.Object({})).constructor.name.should.equal(
      "RESPONSE"
    );
  });

  it("options() should return options", () => {
    const description = "description";
    const example = "example";
    const status = 300;
    const object = validator.Object({});

    const schema = ResponseFactory(object)
      .description(description)
      .status(300)
      .example(example);

    schema.options({ validation: true }).should.deepEqual({
      message,
      status,
      schema: object
    });

    schema.options().should.deepEqual({
      type: "response",
      description,
      example,
      status
    });
  });

  it("toObject() should return object", () => {
    const description = "description";
    const example = "example";
    const object = validator.Object({});

    const schema = ResponseFactory(object)
      .description(description)
      .example(example);

    schema.toObject().should.deepEqual({
      type: "response",
      description,
      example,
      schema: object.toObject(),
      status: 200
    });
  });

  it("validateSync() should fail", () => {
    const object = validator.Object({ name: validator.String() });
    const res = { status: 300, body: { name: undefined } };
    utils.shouldThrow(() => ResponseFactory(object).validateSync(res), {
      body: { name: "Required but is undefined." },
      status: "Must have status code 200 but has 300."
    });
  });

  it("validateSync() should verify", () => {
    const object = validator.Object({ name: validator.String() });
    const expected = { status: 200, body: { name: "Jane Doe" } };
    const actual = ResponseFactory(object).validateSync(expected);
    actual.should.deepEqual(expected);
  });

  it("validateAsync() should fail", async () => {
    const object = validator.Object({ name: validator.String() });
    const res = { status: 300, body: { name: undefined } };
    await utils.shouldEventuallyThrow(ResponseFactory(object).validate(res), {
      body: { name: "Required but is undefined." },
      status: "Must have status code 200 but has 300."
    });
  });

  it("validateAsync() should verify", async () => {
    const object = validator.Object({ name: validator.String() });
    const expected = { status: 200, body: { name: "Jane Doe" } };
    const actual = await ResponseFactory(object).validate(expected);
    actual.should.deepEqual(expected);
  });
});
