const _ = require('lodash');
const ANY = require('./../any').ANY;
const ObjectFactory = require('./../object').ObjectFactory;
const message = require('../../message');
const helper = require('../../helper');

class RESPONSE {
  constructor(status, object, options, defaults) {
    this._status = status;
    this._object = object;
  }

  description(text) {
    this._description = text;
  }

  toObject(options = {}) {
    switch (options.type) {
      case 'raml': {
        return _.pickBy(
          {
            [this._status]: {
              description: this._description,
              body: { 'application/json': this._object.toObject(options) }
            }
          },
          helper.isNotNil
        );
      }
      default: {
        return _.pickBy(
          {
            type: 'response',
            status: this._status,
            description: this._description,
            object: this._object.toObject(options)
          },
          helper.isNotNil
        );
      }
    }
  }
}

exports.ResponseFactory = (status, object, options, defaults) =>
  new RESPONSE(status, object, options, defaults);
