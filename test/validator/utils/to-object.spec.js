const {
  ValidatorFactory
} = require("./../../../src/validator/default/validator");
const {
  ExpressValidatorFactory
} = require("./../../../src/validator/express/validator");
const { toObject } = require("./../../../src/utils/to-object");

describe("toObject()", () => {
  const validator = ValidatorFactory();

  it("should return default object specification", () => {
    const test = { type: "none" };
    toObject(test, { type: "raml" }).should.deepEqual(test);
  });

  it("should return default object specification", () => {
    const test = { type: "none" };
    toObject(test).should.deepEqual(test);
  });

  it("should return any raml specification", () => {
    validator
      .Any()
      .only("test")
      .example("test")
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "any",
        required: true,
        example: "test",
        enum: ["test"]
      });
  });

  it("should return array raml specification", () => {
    validator
      .Array(validator.Any())
      .only("test")
      .example(["test"])
      .min(1)
      .max(4)
      .unique(true)
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "array",
        required: true,
        example: ["test"],
        enum: ["test"],
        items: {
          type: "any",
          required: true,
          example: "No example provided"
        },
        minItems: 1,
        maxItems: 4,
        uniqueItems: true
      });
  });

  it("should return boolean raml specification", () => {
    validator
      .Boolean()
      .only(true)
      .example(true)
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "boolean",
        required: true,
        example: true,
        enum: [true]
      });
  });

  it("should return date raml specification", () => {
    validator
      .Date()
      .only("2018-01-01")
      .example("2018-01-01")
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "datetime",
        required: true,
        example: "2018-01-01",
        enum: ["2018-01-01"]
      });
  });

  it("should return number raml specification", () => {
    validator
      .Number()
      .only(2)
      .example(2)
      .min(2)
      .max(2)
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "number",
        required: true,
        example: 2,
        enum: [2],
        minimum: 2,
        maximum: 2
      });
  });

  it("should return integer raml specification", () => {
    validator
      .Number()
      .integer()
      .only(2)
      .example(2)
      .min(2)
      .max(2)
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "integer",
        required: true,
        example: 2,
        enum: [2],
        minimum: 2,
        maximum: 2
      });
  });

  it("should return object raml specification", () => {
    validator
      .Object({
        name: validator.Any()
      })
      .only({})
      .example({})
      .min(1)
      .max(2)
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "object",
        required: true,
        example: {},
        enum: [{}],
        minProperties: 1,
        maxProperties: 2,
        properties: {
          name: {
            type: "any",
            required: true,
            example: "No example provided"
          }
        }
      });
  });

  it("should return string raml specification", () => {
    validator
      .String()
      .only("test")
      .example("test")
      .regex(/[a-z]/)
      .toObject({ type: "raml" })
      .should.deepEqual({
        type: "string",
        required: true,
        example: "test",
        enum: ["test"],
        pattern: /[a-z]/
      });
  });

  it("should return request raml specification", () => {
    const expressValidator = ExpressValidatorFactory();
    expressValidator
      .Request()
      .params({
        name: expressValidator.String()
      })
      .query({
        limit: expressValidator.Boolean().optional()
      })
      .body(expressValidator.Array())
      .toObject({ type: "raml" })
      .should.deepEqual({
        uriParameters: {
          name: {
            type: "string",
            required: true,
            example: "No example provided"
          }
        },
        queryParameters: {
          limit: {
            type: "boolean",
            required: false,
            example: "No example provided"
          }
        },
        body: {
          "application/json": {
            type: "array",
            required: true,
            example: "No example provided"
          }
        }
      });
  });

  it("should return request raml specification without params, body and query", () => {
    const expressValidator = ExpressValidatorFactory();
    expressValidator
      .Request()
      .toObject({ type: "raml" })
      .should.deepEqual({});
  });

  it("should return response raml specification", () => {
    const expressValidator = ExpressValidatorFactory();
    expressValidator
      .Response()
      .description("description")
      .status(400)
      .body({})
      .toObject({ type: "raml" })
      .should.deepEqual({
        400: {
          description: "description",
          body: {
            "application/json": {
              example: {},
              properties: {},
              required: true,
              type: "object"
            }
          }
        }
      });
  });

  it("should return request raml specification without body", () => {
    const expressValidator = ExpressValidatorFactory();
    expressValidator
      .Response()
      .toObject({ type: "raml" })
      .should.deepEqual({ 200: {} });
  });
});
