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
    const message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal(`Required but is null.`);
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await OBJECT({
      name: STRING()
    }).validate(null);
    should.equal(result, null);

    result = await OBJECT({
      name: STRING()
    }).validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid data type should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).validate(['test'], helper.DEFAULT_OPTIONS));
    message.should.equal(`Must be object.`);
  }));

  it('invalid data should fail', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });

    let message = await helper.shouldThrow(async() => object.validate({}, helper.DEFAULT_OPTIONS));
    message.should.equal('Object is empty.');

    message = await helper.shouldThrow(async() => object.validate({
      name: 10
    }, helper.DEFAULT_OPTIONS));
    message.should.deepEqual({
      name: 'Must be string but is number.'
    });

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

  it('parsed string should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).validate('invalid', {
      parseToType: true
    }));
    message.should.equal('Must be object.');
  }));

  it('parsed string should verify', helper.mochaAsync(async() => {
    const result = await OBJECT({
      name: STRING()
    }).validate('{"name":"Jane Doe"}', {
      parseToType: true
    });

    result.should.deepEqual({
      name: 'Jane Doe'
    });
  }));

  it('invalid default value should throw', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    const result = await helper.shouldThrow(async() => object.defaultValue('invalid'));
    result.message.should.equal('Must be object.');
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    let result = await object.defaultValue({
      name: 'John Doe'
    }).validate();
    result.should.deepEqual({
      name: 'John Doe'
    });

    result = await object.defaultValue({
      name: 'John Doe'
    }).validate({
      name: 'Jane Doe'
    });
    result.should.deepEqual({
      name: 'Jane Doe'
    });
  }));

  it('empty should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    }, {
      noEmptyArrays: true
    });

    let result = await helper.shouldThrow(async() => await object.empty(false).validate({}));
    result.should.equal('Object is empty.');

    result = await object.empty(true).validate({});
    result.should.deepEqual({});
  }));
});
