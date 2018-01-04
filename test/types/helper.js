exports.mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err)
    });
  };
};

exports.DEFAULT_OPTIONS = {
  requiredAsDefault: true,
  throwValidationErrors: true,
  noEmptyStrings: true,
  noEmptyArrays: true,
  noEmptyObjects: true
}