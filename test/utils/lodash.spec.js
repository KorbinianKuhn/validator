const { defaultToAny } = require("./../../src/utils/lodash");
const should = require("should");

describe("lodash", () => {
  it("defaultToAny() should verify", () => {
    const result = defaultToAny(undefined, null, "test", "hello");
    result.should.equal("test");
  });

  it("defaultToAny() return undefined", () => {
    const result = defaultToAny(undefined, null);
    should.equal(result, undefined);
  });
});
