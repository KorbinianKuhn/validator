const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const OBJECT = require('../../src/types/object');
const STRING = require('../../src/types/string');

describe('OBJECT()', function () {
  it('no object should throw', () => {
    (() => {
      OBJECT()
    }).should.throw('Missing object.');
  });

  it('invalid object should throw', () => {
    (() => {
      OBJECT(['test'])
    }).should.throw('Invalid object.');
  });

  it('required but null should fail', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    const result = await object.isValid(null, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    object.errorMessage.should.equal('Required but is null.', 'Wrong error message');
  }));

  it('invalid data type should fail', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    const result = await object.isValid(['test']);
    result.should.be.false();
    object.errorMessage.should.equal('Must be object.')
  }));

  it('invalid data should fail', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });

    let result = await object.isValid({}, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    object.errorMessage.should.equal('Object is empty.');

    result = await object.isValid({
      name: 10
    }, helper.DEFAULT_OPTIONS);
    result.should.be.false();
    object.errorMessage.should.have.property('name', 'Must be string but is number.');
  }));

  it('valid data should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });

    let result = await object.isValid({
      name: 'Jane Doe'
    }, helper.DEFAULT_OPTIONS);
    result.should.be.ok();
  }));
});