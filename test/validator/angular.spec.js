const Validator = require('./../../index').AngularValidator;

describe('AngularValidator()', () => {
  it('constructor()', () => {
    const validator = Validator();
    validator._options.type.should.equal('angular');
    validator._options.messages.should.equal('angular');
  });
});
