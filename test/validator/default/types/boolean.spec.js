const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { Validator } = require("./../../../../index");

chai.use(chaiAsPromised);
const should = chai.should();

describe("Boolean()", () => {
  const validator = Validator();

  it("validate() should verify", async () => {
    await validator
      .Boolean()
      .validate(true)
      .should.eventually.equal(true);
  });

  it("validateSync() should verify", async () => {
    validator
      .Boolean()
      .validateSync(true)
      .should.equal(true);
  });

  it("toObject() should contain all settings", async () => {
    const actual = validator
      .Boolean()
      .default(true)
      .description("description")
      .example("example")
      .parse(false)
      .required(false)
      .toObject();
    const expected = {
      type: "boolean",
      default: true,
      description: "description",
      example: "example",
      parse: false,
      required: false
    };
    actual.should.deep.equal(expected);
  });
});
