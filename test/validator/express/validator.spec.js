const {
  ExpressValidatorFactory
} = require("./../../../src/validator/express/validator");

describe("ExpressValidator()", () => {
  const validator = ExpressValidatorFactory();

  it("should create all types", () => {
    validator.Any().constructor.name.should.equal("ANY");
    validator.Array().constructor.name.should.equal("ARRAY");
    validator.Boolean().constructor.name.should.equal("BOOLEAN");
    validator.Date().constructor.name.should.equal("DATE");
    validator.Number().constructor.name.should.equal("NUMBER");
    validator.Object().constructor.name.should.equal("OBJECT");
    validator.String().constructor.name.should.equal("STRING");
    validator.Request().constructor.name.should.equal("REQUEST");
    validator.Response().constructor.name.should.equal("RESPONSE");
    validator.Params({}).constructor.name.should.equal("OBJECT");
    validator.Query({}).constructor.name.should.equal("OBJECT");
    validator.Body({}).constructor.name.should.equal("OBJECT");
  });

  it("middleware() should return middleware", () => {
    const middleware = validator.middleware();
    (typeof middleware).should.equal("function");
  });
});
