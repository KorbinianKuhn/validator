const LOCALES = require('./../locales');

class Message {
  constructor(locale = 'en') {
    this._locales = LOCALES;
    this._locale = 'en';
    this._messages = this._locales[locale];

    this.setLocale(locale);
  }

  addLocale(name, messages) {
    messages = Object.assign(this._locales['en'], messages);
    this._locales[name] = messages;
    return this;
  }

  setLocale(name) {
    if (name in this._locales) {
      this._locale = name;
      this._messages = this._locales[name];
    } else {
      throw this.error('unknown_locale', { locale: name });
    }
    return this;
  }

  getLocale() {
    return this._locale;
  }

  replace(text, replacements) {
    for (const key in replacements) {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    }
    return text;
  }

  get(code, replacements) {
    let text = this._messages[code];
    return text ? this.replace(text, replacements) : this._messages['default'];
  }

  error(code, replacements) {
    return `${this.get('configuration_error')}: ${this.get(
      code,
      replacements
    )}`;
  }
}
exports.Message = locale => new Message(locale);
