const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { Validator } = require("./../../../../index");

chai.use(chaiAsPromised);
const should = chai.should();

describe("Any()", () => {
  const validator = Validator();

  it("validate() should verify", async () => {
    await validator
      .Any()
      .validate("test")
      .should.eventually.equal("test");
  });

  it("validateSync() should verify", async () => {
    validator
      .Any()
      .validateSync("test")
      .should.equal("test");
  });

  it("toObject() should contain all settings", async () => {
    const actual = validator
      .Any()
      .default("default")
      .description("description")
      .example("example")
      .parse(false)
      .required(false)
      .toObject();
    const expected = {
      type: "any",
      default: "default",
      description: "description",
      example: "example",
      parse: false,
      required: false
    };
    actual.should.deep.equal(expected);
  });
});
