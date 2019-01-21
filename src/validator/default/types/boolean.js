const { ANY } = require('./any');
const { validate, validateSync } = require('./../validation/boolean');
const { removeUndefinedProperties } = require('./../../../utils/lodash');

class BOOLEAN extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
  }

  options(options = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        func: this._func,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'boolean',
        description: this._description,
        example: this.example(),
        default: this._default
      });
    }
  }

  async validate(value) {
    return validate(value, this.options({ validation: true }));
  }

  validateSync(value) {
    return validateSync(value, this.options({ validation: true }));
  }
}

exports.BOOLEAN = BOOLEAN;
exports.BooleanFactory = (options = {}, defaults = {}) =>
  new BOOLEAN(options, defaults);
