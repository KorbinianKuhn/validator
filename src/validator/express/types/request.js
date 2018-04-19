const {
  defaults,
  hasIn,
  defaultTo,
  isPlainObject
} = require("./../../../utils/lodash");
const { ObjectFactory } = require("./../../default/types/object");
const { URI_OPTIONS, QUERY_OPTIONS, BODY_OPTIONS } = require("./../options");
const { toObject } = require("./../../../utils/to-object");
const {
  validateRequest,
  validateRequestSync
} = require("./../validation/request");

const toSchema = (schema, options, defaults) => {
  if (!hasIn(schema, "constructor.name")) {
    throw new Error("Invalid schema.");
  }

  if (["OBJECT", "ARRAY"].indexOf(schema.constructor.name) === -1) {
    if (isPlainObject(schema)) {
      schema = ObjectFactory(schema, options, defaults);
    } else {
      throw new Error("Must be Object or Array Schema.");
    }
  }

  return schema;
};

class REQUEST {
  constructor(options, defaults) {
    this._defaults = defaults(options, defaults);
    this._noUndefinedKeys = defaultTo(
      options.noUndefinedKeys,
      defaults.noUndefinedKeys
    );
  }

  options(options = {}) {
    return {
      params: this._params,
      query: this._query,
      body: this._body,
      defaults: this._defaults
    };
  }

  async validate(req) {
    return validateRequest(req, this.options({ validation: true }));
  }

  validateSync(req) {
    return validateRequestSync(req, this.options({ validation: true }));
  }

  description(description) {
    this.description = description;
    return this;
  }

  example(example) {
    this._example = example;
    return this;
  }

  params(schema, options = {}) {
    this._params = toSchema(
      schema,
      options,
      defaults(URI_OPTIONS, this._defaults)
    );
    return this;
  }

  query(schema, options = {}) {
    this._query = toSchema(
      schema,
      options,
      defaults(QUERY_OPTIONS, this._defaults)
    );
    return this;
  }

  body(schema, options = {}) {
    this._body = toSchema(
      schema,
      options,
      defaults(BODY_OPTIONS, this._defaults)
    );
    return this;
  }

  toObject(options = {}) {
    return toObject(this.options(), options);
  }
}

exports.RequestFactory = (options, defaults) => new REQUEST(options, defaults);
