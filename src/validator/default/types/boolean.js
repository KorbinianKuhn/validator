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
      return removeUndefinedProperties(
        Object.assign(settings, {
          defaultValue: this._default,
          message: this._message,
          func: this._func
        })
      );
    } else {
      return removeUndefinedProperties(
        Object.assign(settings, {
          type: 'boolean',
          description: this._description,
          example: this.example(),
          default: this._default
        })
      );
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
