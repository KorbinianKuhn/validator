const lib = require("./../index");

describe("Library", () => {
  it("should return default validator", () => {
    lib.Validator().constructor.name.should.equal("Validator");
  });

  it("should return angular validator", () => {
    lib.AngularValidator().constructor.name.should.equal("AngularValidator");
  });

  it("should return express validator", () => {
    lib.ExpressValidator().constructor.name.should.equal("ExpressValidator");
  });

  it("should return validation error", () => {
    new lib.ValidationError().constructor.name.should.equal("ValidationError");
  });
});
