const { isArray, isPlainObject } = require("./../../utils/lodash");
const { Validator } = require("./../default/validator");
const middleware = require("./middleware");
const { RequestFactory } = require("./types/request");
const { ResponseFactory } = require("./types/response");
const { ObjectFactory } = require("./../default/types/object");
const { ArrayFactory } = require("./../default/types/array");
const {
  TYPES,
  BODY_OPTIONS,
  QUERY_OPTIONS,
  URI_OPTIONS
} = require("./options");

class ExpressValidator extends Validator {
  constructor(options) {
    super(options);
    this._types = TYPES;
  }

  Request(options = {}) {
    return RequestFactory(options, this._options);
  }

  Params(schema, options = {}) {
    return ObjectFactory(
      schema,
      options,
      Object.assign({}, this._defaults, this._options, URI_OPTIONS)
    );
  }

  Query(schema, options = {}) {
    return ObjectFactory(
      schema,
      options,
      Object.assign({}, this._defaults, this._options, QUERY_OPTIONS)
    );
  }

  Body(schema, options = {}) {
    if (isArray(schema)) {
      return ArrayFactory(
        schema,
        options,
        Object.assign({}, this._defaults, this._options, BODY_OPTIONS)
      );
    } else if (isPlainObject(schema)) {
      return ObjectFactory(
        schema,
        options,
        Object.assign({}, this._defaults, this._options, BODY_OPTIONS)
      );
    } else {
      throw this._message.error("express_object_or_array", {});
    }
  }

  Response(status, object, options = {}) {
    return ResponseFactory(
      status,
      object,
      options,
      Object.assign({}, this._options)
    );
  }

  middleware(options = {}) {
    return middleware(options);
  }
}

exports.ExpressValidatorFactory = (options = {}) =>
  new ExpressValidator(options);
