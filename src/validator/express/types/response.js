const { toObject } = require("./../../../utils/to-object");

class RESPONSE {
  constructor(status, schema) {
    this._status = status;
    this._schema = schema;
  }

  description(text) {
    this._description = text;
  }

  options() {
    return {
      type: "response",
      description: this._description,
      status: this._status,
      schema: this.schema !== undefined ? this._schema.toObject() : undefined
    };
  }

  toObject(options = {}) {
    return toObject(this.options(), options);
  }
}

exports.ResponseFactory = (status, object, options, defaults) =>
  new RESPONSE(status, object, options, defaults);
