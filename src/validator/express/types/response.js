const { toObject } = require("./../../../utils/to-object");
const {
  removeUndefinedProperties,
  defaultToAny,
  hasIn
} = require("./../../../utils/lodash");
const {
  validateResponse,
  validateResponseSync
} = require("./../validation/response");
const { Message } = require("./../../../utils/message");
const { TYPES } = require("./../options");

class RESPONSE {
  constructor(schema, options, defaults) {
    this._message = defaultToAny(
      options.message,
      defaults.message,
      Message("en")
    );
    this._status = 200;

    if (!hasIn(schema, "constructor.name")) {
      throw this._message.error("invalid_schema", {});
    }

    if (TYPES.indexOf(schema.constructor.name) === -1) {
      throw this._message.error("unknown_schema", {});
    }

    this._schema = schema;
  }

  options(options = {}) {
    const settings = { status: this._status };

    if (options.validation) {
      return removeUndefinedProperties(
        Object.assign(settings, {
          message: this._message,
          schema: this._schema
        })
      );
    } else {
      return removeUndefinedProperties(
        Object.assign(settings, {
          type: "response",
          description: this._description,
          example: this.example()
        })
      );
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

  description(text) {
    this._description = text;
    return this;
  }

  example(example) {
    // TODO generate automatic example
    if (example === undefined) {
      return this._example !== undefined
        ? this._example
        : this._schema.example();
    } else {
      this._example = example;
      return this;
    }
  }

  toObject(options = {}) {
    return toObject(
      Object.assign(this.options(), { schema: this._schema.toObject(options) }),
      options
    );
  }
}

exports.ResponseFactory = (schema, options = {}, defaults = {}) =>
  new RESPONSE(schema, options, defaults);
