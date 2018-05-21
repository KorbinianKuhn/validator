const { toObject } = require('./../../../utils/to-object');
const {
  removeUndefinedProperties,
  defaultToAny,
  hasIn,
  isPlainObject
} = require('./../../../utils/lodash');
const {
  validateResponse,
  validateResponseSync
} = require('./../validation/response');
const { Message } = require('./../../../utils/message');
const { TYPES } = require('./../options');
const { ObjectFactory } = require('./../../default/types/object');

class RESPONSE {
  constructor(options, defaults) {
    this._options = { ...defaults, ...options };
    this._message = defaultToAny(
      options.message,
      defaults.message,
      Message('en')
    );
    this._status = 200;
  }

  options(options = {}) {
    const settings = { status: this._status };

    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        message: this._message,
        body: this._body
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'response',
        description: this._description
      });
    }
  }

  async validate(res) {
    return validateResponse(res, this.options({ validation: true }));
  }

  validateSync(res) {
    return validateResponseSync(res, this.options({ validation: true }));
  }

  status(code) {
    this._status = code;
    return this;
  }

  body(schema) {
    if (isPlainObject(schema)) {
      schema = ObjectFactory(schema, {}, this._options);
    } else {
      if (!hasIn(schema, 'constructor.name')) {
        throw this._message.error('invalid_schema', {});
      }

      if (TYPES.indexOf(schema.constructor.name) === -1) {
        throw this._message.error('unknown_schema', {});
      }
    }

    this._body = schema;
    return this;
  }

  description(text) {
    this._description = text;
    return this;
  }

  toObject(options = {}) {
    const object = removeUndefinedProperties({
      body: this._body ? this._body.toObject(options) : undefined
    });

    return toObject({ ...this.options(), ...object }, options);
  }
}

exports.ResponseFactory = (options = {}, defaults = {}) =>
  new RESPONSE(options, defaults);
