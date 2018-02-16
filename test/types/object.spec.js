const should = require('should');
const _ = require('lodash');
const helper = require('./helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Object()', () => {
  it('no object should throw', () => {
    (() => {
      validator.Object();
    }).should.throw('Missing object.');
  });

  it('invalid object should throw', () => {
    (() => {
      validator.Object(['test']);
    }).should.throw('Invalid object.');
  });

  it('required but null should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.Object({
      name: validator.String()
    }).validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal(`Required but is null.`);
  }));

  it('null and undefined should verify', helper.mochaAsync(async () => {
    let result = await validator.Object({
      name: validator.String()
    }).validate(null);
    should.equal(result, null);

    result = await validator.Object({
      name: validator.String()
    }).validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid data type should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.Object({
      name: validator.String()
    }).validate(['test'], helper.DEFAULT_OPTIONS));
    message.should.equal(`Must be an object.`);
  }));

  it('invalid data should fail', helper.mochaAsync(async () => {
    const object = validator.Object({
      name: validator.String()
    });

    let message = await helper.shouldThrow(async () => object.validate({}, helper.DEFAULT_OPTIONS));
    message.should.equal('Object is empty.');

    message = await helper.shouldThrow(async () => object.validate({
      name: 10
    }, helper.DEFAULT_OPTIONS));
    message.should.deepEqual({
      name: 'Must be string but is number.'
    });
  }));

  it('valid data should verify', helper.mochaAsync(async () => {
    const object = validator.Object({
      name: validator.String()
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

  it('parsed string should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.Object({
      name: validator.String()
    }).validate('invalid', {
      parseToType: true
    }));
    message.should.equal('Must be an object.');
  }));

  it('parsed string should verify', helper.mochaAsync(async () => {
    const result = await validator.Object({
      name: validator.String()
    }).validate('{"name":"Jane Doe"}', {
      parseToType: true
    });

    result.should.deepEqual({
      name: 'Jane Doe'
    });
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const object = validator.Object({
      name: validator.String()
    });
    const result = await helper.shouldThrow(async () => object.default('invalid'));
    result.message.should.equal('Must be an object.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    const object = validator.Object({
      name: validator.String()
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

  it('empty should verify', helper.mochaAsync(async () => {
    const object = validator.Object({
      name: validator.String()
    }, {
      noEmptyArrays: true
    });

    let result = await helper.shouldThrow(async () => object.empty(false).validate({}));
    result.should.equal('Object is empty.');

    result = await object.empty(true).validate({});
    result.should.deepEqual({});
  }));

  it('invalid custom function should throw', helper.mochaAsync(async () => {
    (() => {
      validator.Object({}).func('test');
    }).should.throw('Is not a function.');
  }));

  it('test custom functions', helper.mochaAsync(async () => {
    const throwFunction = (name, age) => {
      if (name !== 'Jane Doe' || age !== 20) {
        throw 'Custom message';
      } else {
        return true;
      }
    };
    const object = validator.Object({
      name: validator.String(),
      nested: validator.Object({
        age: validator.Integer(),
      })
    }).func(throwFunction, 'name', 'nested.age');

    const invalid = _.set(_.set({}, 'nested.age', 25), 'name', 'Jane Doe');
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      'name, nested.age': 'Custom message'
    });

    const valid = _.set(_.set({}, 'nested.age', 20), 'name', 'Jane Doe');
    result = await object.validate(valid);
    result.should.deepEqual(valid);
  }));

  it('undefined key should throw', async () => {
    const object = validator.Object({
      name: validator.String()
    }, helper.DEFAULT_OPTIONS);
    let error;
    await object.validate({
      name: 'test',
      invalid: 'invalid'
    }).catch(err => error = err);
    error.should.deepEqual({
      invalid: 'Unknown key.'
    });
  });

  it('undefined key should not throw', async () => {
    const object = validator.Object({
      name: validator.String()
    });
    const data = {
      name: 'test',
      invalid: 'invalid'
    };
    const result = await object.validate(data);
    result.should.deepEqual(data);
  });

  it('min should fail and verify', async () => {
    const valid = {
      name: 'Jane Doe',
      age: 20
    };
    const invalid = {
      name: 'Jane Doe'
    };
    let error;
    const object = validator.Object({
      name: validator.String()
    }).min(2);
    await object.validate(invalid).catch((err) => {
      error = err;
    });
    error.should.equal('Object must have at least 2 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid);
  });

  it('max should fail and verify', async () => {
    const invalid = {
      name: 'Jane Doe',
      age: 20
    };
    const valid = {
      name: 'Jane Doe'
    };
    let error;
    const object = validator.Object({
      name: validator.String()
    }).max(1);
    await object.validate(invalid).catch((err) => {
      error = err;
    });
    error.should.equal('Object must have at most 1 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid);
  });

  it('length should fail and verify', async () => {
    const invalid = {
      name: 'Jane Doe',
      age: 20
    };
    const valid = {
      name: 'Jane Doe'
    };
    let error;
    const object = validator.Object({
      name: validator.String()
    }).length(1);
    await object.validate(invalid).catch((err) => {
      error = err;
    });
    error.should.equal('Object must have exactly 1 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid);
  });

  it.skip('toObject() should verify', async () => {
    const schema = validator.Object({
      name: validator.String(),
      age: validator.Integer()
    }).min(1).max(2).name('My Object').description('A very nice object.').example({ name: 'Jane', age: 25 });
    console.log(schema.toObject());
  });
});
