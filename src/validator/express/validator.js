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

  Params(object, options = {}) {
    return ObjectFactory(
      object,
      options,
      Object.assign({}, this._defaults, this._options, URI_OPTIONS)
    );
  }

  Query(object, options = {}) {
    return ObjectFactory(
      object,
      options,
      Object.assign({}, this._defaults, this._options, QUERY_OPTIONS)
    );
  }

  Body(object, options = {}) {
    return ObjectFactory(
      object,
      options,
      Object.assign({}, this._defaults, this._options, BODY_OPTIONS)
    );
  }

  Response(options = {}) {
    return ResponseFactory(options, Object.assign({}, this._options));
  }

  middleware(options = {}) {
    return middleware(options);
  }
}

exports.ExpressValidatorFactory = (options = {}) =>
  new ExpressValidator(options);
