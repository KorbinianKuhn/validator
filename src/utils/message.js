const { en } = require("./../locales");

class Message {
  constructor(locale) {
    this._locale = en;
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
    return new Error(
      `Validator configuration error: ${this.get(code, replacements)}`
    );
  }

  deprecated(functionName, suggestion) {
    return `Validator deprecation warning: using ${functionName} is deprecated and will be removed on next major version update. Use ${suggestion}.`;
  }
}
exports.Message = locale => new Message(locale);
