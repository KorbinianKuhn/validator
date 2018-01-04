const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const BASE = require('../../src/types/base');

describe('BASE()', function () {
  it('required should be false', () => {
    new BASE().isRequired().should.be.false();
    new BASE().required(false).isRequired().should.be.false();
    const base = new BASE({
      requiredAsDefault: false
    });
    base.isRequired(base.getOptions()).should.be.false();
  });

  it('required should be true', () => {
    new BASE().required(true).isRequired().should.be.ok();
    const base = new BASE({
      requiredAsDefault: true
    });
    base.isRequired(base.getOptions()).should.be.ok();
  });

  it('options override should be correct', () => {
    let base = new BASE();
    base.getOptions().should.eql({}, 'should be empty object');
    base.getOptions({
      setting: true
    }).should.have.property('setting', true);

    base = new BASE({
      setting: false
    });
    base.getOptions().should.have.property('setting', false);
    base.getOptions({
      setting: true
    }).should.have.property('setting', true);

    base.getOptions({
      another: true
    }).should.eql({
      setting: false,
      another: true
    });
  });

});