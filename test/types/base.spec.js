const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const BASE = require('../../src/types/base');

describe('BASE()', () => {
  it('required should be false', () => {
    new BASE().isRequired().should.be.false();
    new BASE().required(false).isRequired().should.be.false();
    const base = new BASE();
    base.isRequired({
      requiredAsDefault: false
    }).should.be.false();
  });

  it('required should be true', () => {
    new BASE().required(true).isRequired().should.be.ok();
    const base = new BASE();
    base.isRequired({
      requiredAsDefault: true
    }).should.be.ok();
  });
});
