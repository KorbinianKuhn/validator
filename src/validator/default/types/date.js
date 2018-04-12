const { defaultToAny } = require("./../../../utils/lodash");
const { ANY } = require("./any");
const { validate, validateSync } = require("./../validation/date");
const moment = require("moment");

const toMoment = (message, date, utc, format, strict) => {
  const momentDate = utc
    ? moment.utc(date, format, strict)
    : moment(date, format, strict);

  if (momentDate.isValid()) {
    return momentDate;
  } else {
    throw this._message.error(
      `Not a valid date. Must match format '${this._format}'.`
    );
  }
};

class DATE extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._format = defaultToAny(
      options.dateFormat,
      defaults.dateFormat,
      "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
    );
    this._utc = defaultToAny(options.utc, defaults.utc, false);
    this._strict = defaultToAny(
      options.strictDateValidation,
      defaults.strictDateValidation,
      false
    );
  }

  options(options = {}) {
    const settings = {
      required: this._required,
      parse: this._parse,
      format: this._format,
      utc: this._utc,
      strict: this._strict,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return Object.assign(settings, {
        defaultValue: this._default,
        message: this._message,
        min: this._min,
        max: this._max
      });
    } else {
      return Object.assign(settings, {
        type: "date",
        description: this._description,
        example: this._example,
        default: this._default,
        min: this._min ? this._min : undefined,
        max: this._max ? this._max : undefined
      });
    }
  }

  async validate(value) {
    return validate(value, this.options({ validation: true }));
  }

  validateSync(value) {
    return validateSync(value, this.options({ validation: true }));
  }

  format(string) {
    this._format = string;
    return this;
  }

  default(value) {
    toMoment(this._message, value, this._utc, this._format, this._strict);
    this._default = value;
    return this;
  }

  strict(boolean) {
    this._strict = boolean;
    return this;
  }

  utc(boolean) {
    this._utc = boolean;
    return this;
  }

  min(date) {
    this._min = toMoment(
      this._message,
      date,
      this._utc,
      this._format,
      this._strict
    ).toISOString();
    return this;
  }

  max(date) {
    this._max = toMoment(
      this._message,
      date,
      this._utc,
      this._format,
      this._strict
    ).toISOString();
    return this;
  }
}

exports.DATE = DATE;
exports.DateFactory = (options, defaults) => new DATE(options, defaults);
