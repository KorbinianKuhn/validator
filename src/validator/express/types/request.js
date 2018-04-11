const toSchema = (schema, options, defaults) => {
  if (!_.hasIn(schema, 'constructor.name')) {
    throw new Error('Invalid schema.');
  }

  if (['OBJECT', 'ARRAY'].indexOf(schema.constructor.name) === -1) {
    if (_.isPlainObject(schema)) {
      schema = ObjectFactory(schema, options, defaults);
    } else {
      throw new Error('Must be Object or Array Schema.');
    }
  }

  return schema;
};

class REQUEST extends ANY {
  constructor(options, defaults) {
    super(options, defaults);
    this._defaults = _.defaults(options, defaults);
    this._noUndefinedKeys = _.defaultTo(
      options.noUndefinedKeys,
      defaults.noUndefinedKeys
    );
  }

  async validate(value) {
    return validateRequest(value, this);
  }

  params(schema, options = {}) {
    this._params = toSchema(
      schema,
      options,
      _.defaults({}, URI_OPTIONS, this._defaults)
    );
    return this;
  }

  query(schema, options = {}) {
    this._query = toSchema(
      schema,
      options,
      _.defaults({}, QUERY_OPTIONS, this._defaults)
    );
    return this;
  }

  body(schema, options = {}) {
    this._body = toSchema(
      schema,
      options,
      _.defaults({}, BODY_OPTIONS, this._defaults)
    );
    return this;
  }

  toObject(options = {}) {
    const params = this._params
      ? this._params.toObject(options).properties
      : undefined;
    const query = this._query
      ? this._query.toObject(options).properties
      : undefined;
    const body = this._body
      ? { 'application/json': this._body.toObject(options) }
      : undefined;
    switch (options.type) {
      case 'raml': {
        return _.pickBy(
          {
            description: this._description,
            uriParameters: params,
            queryParameters: query,
            body
          },
          helper.isNotNil
        );
      }
      default: {
        return _.pickBy(
          {
            type: 'request',
            required: this._required,
            name: this._name,
            description: this._description,
            default: this._default,
            example: this._example,
            examples: this._examples,
            params,
            query,
            body
          },
          helper.isNotNil
        );
      }
    }
  }
}

exports.RequestFactory = (options, defaults) => new REQUEST(options, defaults);
