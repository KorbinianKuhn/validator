const defaults = require('../../src/defaults');

exports.mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err)
    });
  };
};

exports.shouldThrow = async(fn) => {
  try {
    await fn();
  } catch (err) {
    return err;
  }

  throw new Error("Did not throw");
}

exports.DEFAULT_OPTIONS = defaults.VALIDATOR_OPTIONS;
