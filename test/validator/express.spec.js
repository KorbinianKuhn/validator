const Validator = require('./../../index').ExpressValidator;

describe('ExpressValidator()', () => {
  it('constructor()', () => {
    const validator = Validator();
    validator._options.type.should.equal('express');
    validator._options.messages.should.equal('default');
  });

  it('request type should get created', () => {
    const validator = Validator();
    validator.Request().constructor.name.should.equal('REQUEST');
  });
});
