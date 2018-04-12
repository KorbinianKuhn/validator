const LOCALES = require("./../locales");

class Message {
  constructor(locale = "en") {
    if (locale in LOCALES) {
      this._locale = LOCALES["en"];
      this.error("unknown_locale", "locale");
    } else {
      this._locale = LOCALES[locale];
    }
  }

  get(code, replacements) {
    let text = this._locale[code];
    if (!text) {
      return "Invalid.";
    } else {
      for (const key in replacements) {
        text = text.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
      }
      return text;
    }
  }

  error(code, replacements) {
    return `${this.get("configuration_error")}: ${this.get(
      code,
      replacements
    )}`;
  }
}
exports.Message = locale => new Message(locale);
