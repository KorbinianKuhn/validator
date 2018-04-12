const LOCALES = require("./../src/locales");
const { AssertionError } = require("assert");

describe.skip("locales", () => {
  it("all locales should have the keys as 'en'", () => {
    const en = LOCALES["en"];
    const locales = {};
    for (const key in LOCALES) {
      if (key !== "en") {
        const locale = LOCALES[key];
        const errors = {};

        for (const key in en) {
          if (!(key in locale)) {
            errors[key] = "Missing key";
          }
        }

        for (const key in locale) {
          if (!(key in en)) {
            errors[key] = "Unknown key";
          }
        }

        if (Object.keys(errors).length > 0) {
          locales[key] = errors;
        }
      }
    }

    if (Object.keys(locales).length > 0) {
      throw new AssertionError({
        message: "Missing or unknown keys in locales",
        actual: locales,
        expected: {}
      });
    }
  });
});
