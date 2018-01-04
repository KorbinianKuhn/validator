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
    try {
      await OBJECT({
        name: STRING()
      }).validate(null, helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Required but is null.`);
    }
  }));

  it('invalid data type should fail', helper.mochaAsync(async() => {
    try {
      await OBJECT({
        name: STRING()
      }).validate(['test'], helper.DEFAULT_OPTIONS);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.equal(`Must be object.`);
    }
  }));

  it('invalid data should fail', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });

    try {
      await object.validate({}, helper.DEFAULT_OPTIONS);
    } catch (err) {
      err.should.equal('Object is empty.');
    }

    try {
      await object.validate({
        name: 10
      }, helper.DEFAULT_OPTIONS);
    } catch (err) {
      err.should.have.property('name', 'Must be string but is number.');
    }

  }));

  it('valid data should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });

    let result = await object.validate({
      name: 'Jane Doe'
    }, helper.DEFAULT_OPTIONS);
    result.should.deepEqual({
      name: 'Jane Doe'
    });

    result = await object.validate({
      name: 'John Doe'
    });
    result.should.deepEqual({
      name: 'John Doe'
    });

  }));
});
