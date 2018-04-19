const _ = require("./../../utils/lodash");
const { Validator } = require("./../default/validator");
const middleware = require("./middleware");
const { RequestFactory } = require("./types/request");
const { ResponseFactory } = require("./types/response");
const { ObjectFactory } = require("./../default/types/object");
const { ArrayFactory } = require("./../default/types/array");

const TYPES = [
  "ANY",
  "ARRAY",
  "BOOLEAN",
  "DATE",
  "NUMBER",
  "OBJECT",
  "STRING",
  "REQUEST",
  "RESPONSE"
];

const { BODY_OPTIONS, QUERY_OPTIONS, URI_OPTIONS } = require("./options");

class ExpressValidator extends Validator {
  constructor(options) {
    super(options);
    this._types = TYPES;
  }

  Request(options = {}) {
    return RequestFactory(options, _.defaults(this._options));
  }

  Params(schema, options = {}) {
    return ObjectFactory(
      schema,
      options,
      _.defaults(URI_OPTIONS, this._options, this._defaults)
    );
  }

  Query(schema, options = {}) {
    return ObjectFactory(
      schema,
      options,
      _.defaults(QUERY_OPTIONS, this._options, this._defaults)
    );
  }

  Body(schema, options = {}) {
    if (_.isArray(schema)) {
      return ArrayFactory(
        schema,
        options,
        _.defaults(BODY_OPTIONS, this._options, this._defaults)
      );
    } else if (_.isPlainObject(schema)) {
      return ObjectFactory(
        schema,
        options,
        _.defaults(BODY_OPTIONS, this._options, this._defaults)
      );
    } else {
      throw new Error("Only plain object or array is allowed");
    }
  }

  Response(status, object, options = {}) {
    return ResponseFactory(
      status,
      object,
      options,
      _.defaults({}, this._options)
    );
  }

  middleware(options = {}) {
    return middleware(options);
  }
}

exports.ExpressValidatorFactory = (options = {}) =>
  new ExpressValidator(options);
