const {
  hasIn,
  defaultToAny,
  isPlainObject,
  removeUndefinedProperties
} = require("./../../../utils/lodash");
const { ObjectFactory } = require("./../../default/types/object");
const { URI_OPTIONS, QUERY_OPTIONS, BODY_OPTIONS } = require("./../options");
const { toObject } = require("./../../../utils/to-object");
const {
  validateRequest,
  validateRequestSync
} = require("./../validation/request");
const { Message } = require("./../../../utils/message");

const toSchema = (schema, options, defaults, message, allowArray = false) => {
  if (!hasIn(schema, "constructor.name")) {
    throw message.error("invalid_schema", {});
  }

  switch (schema.constructor.name) {
    case "OBJECT":
      break;
    case "ARRAY": {
      if (!allowArray) {
        throw message.error("invalid_schema", {});
      }
      break;
    }
    default: {
      if (isPlainObject(schema)) {
        schema = ObjectFactory(schema, options, defaults);
      } else {
        throw message.error("express_object_or_array_schema", {});
      }
    }
  }

  return schema;
};
exports.toSchema = toSchema;

class REQUEST {
  constructor(options, defaults) {
    this._options = Object.assign({}, defaults, options);
    this._message = defaultToAny(
      options.message,
      defaults.message,
      Message("en")
    );
    this._unknown = defaultToAny(
      options.unknownObjectKeys,
      defaults.unknownObjectKeys,
      true
    );
  }

  options(options = {}) {
    const settings = {
      unknown: this._unknown
    };

    if (options.validation) {
      return removeUndefinedProperties(
        Object.assign(settings, {
          message: this._message,
          params: this._params,
          query: this._query,
          body: this._body
        })
      );
    } else {
      return removeUndefinedProperties(
        Object.assign(settings, {
          type: "request",
          description: this._description
        })
      );
    }
  }

  async validate(req) {
    return validateRequest(req, this.options({ validation: true }));
  }

  validateSync(req) {
    return validateRequestSync(req, this.options({ validation: true }));
  }

  description(description) {
    this._description = description;
    return this;
  }

  params(schema, options = {}) {
    this._params = toSchema(
      schema,
      options,
      Object.assign({}, this._options, URI_OPTIONS),
      this._message,
      false
    );
    return this;
  }

  query(schema, options = {}) {
    this._query = toSchema(
      schema,
      options,
      Object.assign({}, this._options, QUERY_OPTIONS),
      this._message,
      false
    );
    return this;
  }

  body(schema, options = {}) {
    this._body = toSchema(
      schema,
      options,
      Object.assign({}, this._options, BODY_OPTIONS),
      this._message,
      true
    );
    return this;
  }

  toObject(options = {}) {
    const object = removeUndefinedProperties({
      params: this._params ? this._params.toObject(options) : undefined,
      query: this._query ? this._query.toObject(options) : undefined,
      body: this._body ? this._body.toObject(options) : undefined
    });
    return toObject(Object.assign(this.options(), object), options);
  }
}

exports.RequestFactory = (options = {}, defaults = {}) =>
  new REQUEST(options, defaults);
