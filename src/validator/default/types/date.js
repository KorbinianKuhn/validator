const {
  defaultToAny,
  removeUndefinedProperties
} = require('./../../../utils/lodash');
const { ANY } = require('./any');
const { validate, validateSync } = require('./../validation/date');
const { toDate } = require('./../../../utils/date');

class DATE extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._utc = defaultToAny(options.utc, defaults.utc, false);
  }

  options(options = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      utc: this._utc,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        func: this._func,
        min: this._min,
        max: this._max,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'date',
        description: this._description,
        example: this.example(),
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

  utc(boolean) {
    this._utc = boolean;
    return this;
  }

  min(value) {
    this._min = toDate(this._message, value, this._utc).toISOString();
    return this;
  }

  max(value) {
    this._max = toDate(this._message, value, this._utc).toISOString();
    return this;
  }

  // TODO unix
  // unix() {
  //   return this;
  // }
}

exports.DATE = DATE;
exports.DateFactory = (options = {}, defaults = {}) =>
  new DATE(options, defaults);
