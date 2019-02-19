import { Locales } from '../interfaces/locales.interface';
import { Locale } from '../interfaces/locale.interface';
import { LOCALES } from '../locales';

interface Replacement {
  [key: string]: string;
}

export class Message {
  private _locales: Locales;
  private _locale: string;
  private _messages: Locale;

  constructor(locale = 'en') {
    this._locales = LOCALES;
    this._locale = 'en';
    this._messages = this._locales[locale];

    this.setLocale(locale);
  }

  addLocale(name: string, messages: Locale, fallback = 'en'): Message {
    if (!(fallback in this._locales)) {
      throw this.error('unknown_locale', { locale: name });
    }
    messages = { ...this._locales[fallback], ...messages };
    this._locales[name] = messages;
    return this;
  }

  setLocale(name): Message {
    if (name in this._locales) {
      this._locale = name;
      this._messages = this._locales[name];
    } else {
      throw this.error('unknown_locale', { locale: name });
    }
    return this;
  }

  getLocale(): string {
    return this._locale;
  }

  replace(text: string, replacements: Replacement): string {
    for (const key in replacements) {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    }
    return text;
  }

  get(code: string, replacements: Replacement = {}): string {
    let text = this._messages[code];
    return text ? this.replace(text, replacements) : this._messages['default'];
  }

  error(code: string, replacements: Replacement = {}): string {
    return `${this.get('configuration_error')}: ${this.get(
      code,
      replacements
    )}`;
  }
}
