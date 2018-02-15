const defaults = require('../../src/defaults');

exports.mochaAsync = fn => (done) => {
  fn.call().then(done, (err) => {
    done(err);
  });
};

exports.shouldThrow = async (fn) => {
  try {
    await fn();
  } catch (err) {
    return err;
  }

  throw new Error("Did not throw");
};

exports.DEFAULT_OPTIONS = defaults.VALIDATOR_OPTIONS;
exports.DATE_FORMAT = defaults.DATE_FORMAT;

exports.throw = async (promise, message) => {
  let error;
  try {
    await promise;
  } catch (err) {
    error = err;
  }
  if (error === null) {
    throw new Error('Did not throw');
  }

  if (message) error.should.equal(message);
};

exports.throwError = async (func, message) => {
  let error;
  try {
    func();
  } catch (err) {
    error = err;
  }
  if (error === null) {
    throw new Error('Did not throw');
  }

  if (message) error.should.equal(message);
};
