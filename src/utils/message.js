const { en } = require("./../locales");
const { ValueError } = require("./error");

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

  error(code, replacements, options = {}) {
    let message;
    if (options.configuration) {
      message = `Validator configuration error: ${this.get(
        code,
        replacements
      )}`;
    } else {
      message = this.get(code, replacements);
    }
    return message;
  }

  deprecated(functionName, suggestion) {
    return `Validator deprecation warning: using ${functionName} is deprecated and will be removed on next major version update. Use ${suggestion}.`;
  }
}
exports.Message = locale => new Message(locale);
