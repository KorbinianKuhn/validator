const {
  AngularValidatorFactory
} = require("./../../../src/validator/angular/validator");
const should = require("should");

describe("AngularValidator()", () => {
  const validator = AngularValidatorFactory();

  it("should create all types", () => {
    validator.Any().constructor.name.should.equal("ANY_ANGULAR");
    validator.Array().constructor.name.should.equal("ARRAY_ANGULAR");
    validator.Boolean().constructor.name.should.equal("BOOLEAN_ANGULAR");
    validator.Date().constructor.name.should.equal("DATE_ANGULAR");
    validator.Number().constructor.name.should.equal("NUMBER_ANGULAR");
    validator.Object().constructor.name.should.equal("OBJECT_ANGULAR");
    validator.String().constructor.name.should.equal("STRING_ANGULAR");
  });

  it("Any().validate() should verify", async () => {
    const actual = await validator.Any().validate()({ value: "test" });
    should.equal(actual, null);
  });

  it("Any().validate() should fail", async () => {
    const actual = await validator.Any().validate()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Any().validateSync() should verify", () => {
    const actual = validator.Any().validateSync()({ value: "test" });
    should.equal(actual, null);
  });

  it("Any().validateSync() should fail", () => {
    const actual = validator.Any().validateSync()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Array().validate() should verify", async () => {
    const actual = await validator.Array().validate()({ value: "test" });
    should.equal(actual, null);
  });

  it("Array().validate() should fail", async () => {
    const actual = await validator.Array().validate()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Array().validateSync() should verify", () => {
    const actual = validator.Array().validateSync()({ value: "test" });
    should.equal(actual, null);
  });

  it("Array().validateSync() should fail", () => {
    const actual = validator.Array().validateSync()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Boolean().validate() should verify", async () => {
    const actual = await validator.Boolean().validate()({ value: true });
    should.equal(actual, null);
  });

  it("Boolean().validate() should fail", async () => {
    const actual = await validator.Boolean().validate()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Boolean().validateSync() should verify", () => {
    const actual = validator.Boolean().validateSync()({ value: true });
    should.equal(actual, null);
  });

  it("Boolean().validateSync() should fail", () => {
    const actual = validator.Boolean().validateSync()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Date().validate() should verify", async () => {
    const actual = await validator.Date().validate()({
      value: "2018-01-01T00:00:00.000Z"
    });
    should.equal(actual, null);
  });

  it("Date().validate() should fail", async () => {
    const actual = await validator.Date().validate()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Date().validateSync() should verify", () => {
    const actual = validator.Date().validateSync()({
      value: "2018-01-01T00:00:00.000Z"
    });
    should.equal(actual, null);
  });

  it("Date().validateSync() should fail", () => {
    const actual = validator.Date().validateSync()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Number().validate() should verify", async () => {
    const actual = await validator.Number().validate()({ value: 2 });
    should.equal(actual, null);
  });

  it("Number().validate() should fail", async () => {
    const actual = await validator.Number().validate()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Number().validateSync() should verify", () => {
    const actual = validator.Number().validateSync()({ value: 2 });
    should.equal(actual, null);
  });

  it("Number().validateSync() should fail", () => {
    const actual = validator.Number().validateSync()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Object().validate() should verify", async () => {
    const actual = await validator
      .Object()
      .empty(true)
      .validate()({ value: {} });
    should.equal(actual, null);
  });

  it("Object().validate() should fail", async () => {
    const actual = await validator.Object().validate()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("Object().validateSync() should verify", () => {
    const actual = validator
      .Object()
      .empty(true)
      .validateSync()({ value: {} });
    should.equal(actual, null);
  });

  it("Object().validateSync() should fail", () => {
    const actual = validator.Object().validateSync()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("String().validate() should verify", async () => {
    const actual = await validator.String().validate()({ value: "test" });
    should.equal(actual, null);
  });

  it("String().validate() should fail", async () => {
    const actual = await validator.String().validate()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });

  it("String().validateSync() should verify", () => {
    const actual = validator.String().validateSync()({ value: "test" });
    should.equal(actual, null);
  });

  it("String().validateSync() should fail", () => {
    const actual = validator.String().validateSync()({ value: "" });
    actual.should.deepEqual({ validation: "Required but is null." });
  });
});
