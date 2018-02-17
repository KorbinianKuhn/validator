const defaults = require('../src/defaults');
const _ = require('lodash');

exports.DEFAULT_OPTIONS = defaults.VALIDATOR_OPTIONS;
exports.DATE_FORMAT = defaults.DATE_FORMAT;

exports.throw = async (func, message) => {
  let error;
  try {
    if (['AsyncFunction', 'Promise'].indexOf(func.constructor.name) !== -1) {
      await func;
    } else {
      func();
    }
  } catch (err) {
    error = err;
  }
  if (_.isNil(error)) {
    throw new Error('Did not throw');
  }

  if (message) {
    if (error instanceof Error) {
      error = error.message;
    }
    if (_.isObject(message)) {
      error.should.deepEqual(message);
    } else {
      error.should.equal(message);
    }
  }
};
