const should = require('should');
const _ = require('lodash');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Object()', () => {
  describe('constructor()', () => {
    it('no object should throw', async () => {
      await helper.throw(() => validator.Object(),'Missing object.');
    });

    it('invalid object should throw', async () => {
      await helper.throw(() => validator.Object(['test']), 'Invalid object.');
    });
  });

  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Object({ name: validator.String() })
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Object({ name: validator.String() })
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid data type should fail', async () => {
    await helper.throw(validator.Object({ name: validator.String() }).validate(['test']), `Must be an object.`);
  });

  it('invalid data should fail', async () => {
    const object = validator.Object({ name: validator.String() });
    await helper.throw(object.validate({}), 'Object is empty.');
    await helper.throw(object.validate({ name: 10 }), { name: 'Must be string but is number.' });
  });

  it('valid data should verify', async () => {
    const object = validator.Object({ name: validator.String() });

    let result = await object.validate({ name: 'Jane Doe' });
    result.should.deepEqual({ name: 'Jane Doe' });

    result = await object.validate({ name: 'John Doe' });
    result.should.deepEqual({ name: 'John Doe' });
  });

  it('parsed string should fail', async () => {
    const object = validator.Object({ name: validator.String() }).parse(true);
    await helper.throw(object.validate('invalid'), 'Must be an object.');
  });

  it('parsed string should verify', async () => {
    const object = validator.Object({ name: validator.String() }).parse(true);
    const result = await object.validate('{"name":"Jane Doe"}');
    result.should.deepEqual({ name: 'Jane Doe' });
  });

  it('invalid default value should throw', async () => {
    const object = validator.Object({ name: validator.String() });
    await helper.throw(() => object.default('invalid'), 'Must be an object.');
  });

  it('valid default value should verify', async () => {
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
  });

  it('empty should verify', async () => {
    const object = validator.Object({ name: validator.String().required(false) });

    await helper.throw(object.validate({}), 'Object is empty.');

    const result = await object.empty(true).validate({});
    result.should.deepEqual({});
  });

  it('invalid custom function should throw', async () => {
    await helper.throw(() => validator.Object({}).func('test'), 'Is not a function.');
  });

  it('test custom functions', async () => {
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

    const invalid = { name: 'Jane Doe', nested: { age: 25 } };
    await helper.throw(object.validate(invalid), { '[name, nested.age]': 'Custom message' });

    const valid = { name: 'Jane Doe', nested: { age: 20 } };
    const result = await object.validate(valid);
    result.should.deepEqual(valid);
  });

  it('test custom function that throws an error', async () => {
    const throwFunction = (name, age) => {
      throw new Error('Custom message');
    };
    const object = validator.Object({
      name: validator.String(),
      nested: validator.Object({
        age: validator.Integer(),
      })
    }).func(throwFunction, 'name', 'nested.age');

    const invalid = { name: 'Jane Doe', nested: { age: 25 } };
    await helper.throw(object.validate(invalid), { '[name, nested.age]': 'Custom message' });
  });

  it('undefined key should throw', async () => {
    const object = validator.Object({ name: validator.String() });
    const invalid = { name: 'test', invalid: 'invalid' };
    await helper.throw(object.validate(invalid), { invalid: 'Unknown key.' });
  });

  it('undefined key should not throw', async () => {
    const object = validator.Object({ name: validator.String() }, { noUndefinedKeys: false });
    const data = { name: 'test', invalid: 'invalid' };
    const result = await object.validate(data);
    result.should.deepEqual(data);
  });

  it('min should fail and verify', async () => {
    const valid = { name: 'Jane Doe', age: 20 };
    const invalid = { name: 'Jane Doe' };
    const object = validator.Object({ name: validator.String().required(false), age: validator.Integer().required(false) }).min(2);
    await helper.throw(object.validate(invalid), 'Object must have at least 2 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid);
  });

  it('max should fail and verify', async () => {
    const invalid = { name: 'Jane Doe', age: 20 };
    const valid = { name: 'Jane Doe' };
    const object = validator.Object({ name: validator.String() }).max(1);
    await helper.throw(object.validate(invalid), 'Object must have at most 1 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid);
  });

  it('length should fail and verify', async () => {
    const invalid = { name: 'Jane Doe', age: 20 };
    const valid = { name: 'Jane Doe' };

    const object = validator.Object({ name: validator.String() }).length(1);
    await helper.throw(object.validate(invalid), 'Object must have exactly 1 keys.');

    const result = await object.validate(valid);
    result.should.deepEqual(valid);
  });

  describe('toObject()', () => {
    it('should return object description', async () => {
      const actual = validator.Object({ name: validator.String() })
        .name('name')
        .description('description')
        .toObject();
      actual.should.deepEqual({
        type: 'object',
        name: 'name',
        description: 'description',
        required: true,
        empty: false,
        properties: {
          name: {
            empty: false, required: true, trim: true, type: "string"
          }
        }
      });
    });

    it('type raml should verify', async () => {
      const object = validator.Object({}).toObject({ type: 'raml' });
      object.should.be.type('object');
    });
  });
});
