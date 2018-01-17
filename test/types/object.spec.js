const assert = require('assert');
const should = require('should');
const _ = require('lodash');
const helper = require('./helper');
const OBJECT = require('../../src/types/object');
const STRING = require('../../src/types/string');
const INTEGER = require('../../src/types/integer');

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
    const result = await helper.shouldThrow(async() => object.default('invalid'));
    result.message.should.equal('Must be object.');
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    let result = await object.default({
      name: 'John Doe'
    }).validate();
    result.should.deepEqual({
      name: 'John Doe'
    });

    result = await object.default({
      name: 'John Doe'
    }).validate({
      name: 'Jane Doe'
    });
    result.should.deepEqual({
      name: 'Jane Doe'
    });
  }));

  it('deprecated function defaultValue should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    let result = await object.defaultValue({
      name: 'John Doe'
    }).validate();
    result.should.deepEqual({
      name: 'John Doe'
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

  it('invalid custom function should throw', helper.mochaAsync(async() => {
    (() => {
      OBJECT({}).func('test');
    }).should.throw('Is not a function.');
  }));

  it('test custom functions', helper.mochaAsync(async() => {
    const throwFunction = (name, age) => {
      if (name !== 'Jane Doe' || age !== 20) {
        throw 'Custom message'
      } else {
        return true;
      }
    }
    const object = OBJECT({
      name: STRING(),
      nested: OBJECT({
        age: INTEGER(),
      })
    }).func(throwFunction, 'name', 'nested.age');

    const invalid = _.set(_.set({}, 'nested.age', 25), 'name', 'Jane Doe');
    let result = await helper.shouldThrow(async() => await object.validate(invalid));
    result.should.deepEqual({
      'name, nested.age': 'Custom message'
    });

    const valid = _.set(_.set({}, 'nested.age', 20), 'name', 'Jane Doe');
    result = await object.validate(valid);
    result.should.deepEqual(valid);
  }));

  it('undefined key should throw', async() => {
    const object = OBJECT({
      name: STRING()
    }, helper.DEFAULT_OPTIONS);
    let error;
    await object.validate({
      name: 'test',
      invalid: 'invalid'
    }).catch(err => error = err);
    error.should.deepEqual({
      invalid: 'Invalid key.'
    });
  });

  it('undefined key should not throw', async() => {
    const object = OBJECT({
      name: STRING()
    });
    const data = {
      name: 'test',
      invalid: 'invalid'
    }
    const result = await object.validate(data).catch(err => error = err);
    result.should.deepEqual(data);
  });

  it('min should fail and verify', async() => {
    const valid = {
      name: 'Jane Doe',
      age: 20
    };
    const invalid = {
      name: 'Jane Doe'
    };
    let error;
    const object = OBJECT({
      name: STRING()
    }).min(2);
    await object.validate(invalid).catch((err) => {
      error = err;
    });
    error.should.equal('Object must have at least 2 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid)
  });

  it('max should fail and verify', async() => {
    const invalid = {
      name: 'Jane Doe',
      age: 20
    };
    const valid = {
      name: 'Jane Doe'
    };
    let error;
    const object = OBJECT({
      name: STRING()
    }).max(1);
    await object.validate(invalid).catch((err) => {
      error = err;
    });
    error.should.equal('Object must have at most 1 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid)
  });

  it('length should fail and verify', async() => {
    const invalid = {
      name: 'Jane Doe',
      age: 20
    };
    const valid = {
      name: 'Jane Doe'
    };
    let error;
    const object = OBJECT({
      name: STRING()
    }).length(1);
    await object.validate(invalid).catch((err) => {
      error = err;
    });
    error.should.equal('Object must have exactly 1 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid)
  });
});
