const Validator = require('./any').Validator;
const { TYPES, TYPE_NAMES }= require('../types/angular');
const _ = require('lodash');

class AngularValidator extends Validator {
  constructor(options) {
    options.messages = 'angular';
    options.type = 'angular';
    super(options);
    this._types = TYPE_NAMES;
  }

  addType(name, type) {
    if (_.has(this._customs, name)) {
      throw new Error(`Error adding custom type. Name '${name}' is already set.`);
    }

    this._customs[name] = _.cloneDeep(type);
  }

  Any(type, options = {}) {
    return TYPES.Any(options, this._options);
  }

  Array(type, options = {}) {
    return TYPES.Array(type, options, this._options);
  }

  Boolean(options = {}) {
    return TYPES.Boolean(options, this._options);
  }

  Date(options = {}) {
    return TYPES.Date(options, this._options);
  }

  Enum(values, options = {}) {
    return TYPES.Enum(values, options, this._options);
  }

  Function(func, options = {}) {
    return TYPES.Function(func, options, this._options);
  }

  Integer(options = {}) {
    return TYPES.Integer(options, this._options);
  }

  Number(options = {}) {
    return TYPES.Number(options, this._options);
  }

  Object(schema, options = {}) {
    return TYPES.Object(schema, options, this._options);
  }

  Regex(regex, options = {}) {
    return TYPES.Regex(regex, options, this._options);
  }

  String(options = {}) {
    return TYPES.String(options, this._options);
  }
}

exports.AngularValidatorFactory = (options = {}) => new AngularValidator(options);
