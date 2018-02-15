const _ = require('lodash');
const BASE = require('./base');
const message = require('../message');
const helper = require('../helper');

const _private = Symbol('Private variables');

const validateBoolean = async (value, privates, options) => {
  if (_.isNil(value)) {
    if (privates.default) return privates.default;
    if (privates.required) throw message.required(options.language, options.type, value);
    return value;
  }

  if (options.parseToType) {
    if (value === 'true') value = true;
    if (value === 'false') value = false;
  }

  if (!_.isBoolean(value)) throw message.wrongType(options.language, options.type, 'boolean', typeof value);

  return value;
};

class BOOLEAN extends BASE {
  constructor(options) {
    super();
    this[_private] = {};
    this[_private].options = options || {};
  }

  async validate(value, options = {}) {
    options = _.defaults(this[_private].options, options);

    const func = validateBoolean(value, {
      required: this.isRequired(options),
      default: this[_private].default
    }, options);

    return helper.validate(options.type, func);
  }

  default(value) {
    if (!_.isBoolean(value)) {
      throw new Error('Must be boolean.');
    }
    this[_private].default = value;
    return this;
  }

  toObject() {
    const object = {
      type: 'boolean',
      required: this.isRequired(this[_private].options)
    };

    if (this.name()) object.displayName = this.name();
    if (this.description()) object.description = this.description();
    if (this.examples()) {
      object.examples = this.examples();
    } else if (this.example()) {
      object.example = this.example();
    }
    if (this[_private].default) object.default = this[_private].default;

    return object;
  }
}

function BooleanFactory(options) {
  return new BOOLEAN(options);
}
module.exports = BooleanFactory;
