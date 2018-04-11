const helper = require('../helper');
const _ = require('lodash');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Object(): conditions', () => {
  it('invalid key in condition should fail', async () => {
    const object = validator.Object({ name: validator.String() });
    await helper.throw(
      () => object.conditions({ age: { gt: 'name' } }),
      `Object has no key 'age'.`
    );
    await helper.throw(
      () => object.conditions({ name: { gt: 'age' } }),
      `Object has no key 'age'.`
    );
  });

  it('invalid condition method should fail', async () => {
    const object = validator.Object({ name: validator.String() });
    await helper.throw(
      () => object.conditions({ name: { invalid: 'name' } }),
      `Object has no condition method 'invalid'.`
    );
  });

  describe('greater condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .conditions({ smaller: { gt: 'bigger' } });

      const invalid = { bigger: 10, smaller: 5 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be greater than bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('gt() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .gt('smaller', 'bigger');

      const invalid = { bigger: 10, smaller: 5 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be greater than bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  describe('greater or equal condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .conditions({ smaller: { gte: 'bigger' } });

      const invalid = { bigger: 10, smaller: 5 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be greater or equal than bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('gte() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .gte('smaller', 'bigger');

      const invalid = { bigger: 10, smaller: 5 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be greater or equal than bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  describe('less condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .conditions({ smaller: { lt: 'bigger' } });

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be less than bigger.`
      });

      const valid = { bigger: 10, smaller: 5 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('lt() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .lt('smaller', 'bigger');

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be less than bigger.`
      });

      const valid = { bigger: 10, smaller: 5 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  describe('less or equal condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .conditions({ smaller: { lte: 'bigger' } });

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be less or equal than bigger.`
      });

      const valid = { bigger: 10, smaller: 5 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('lte() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .lte('smaller', 'bigger');

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must be less or equal than bigger.`
      });

      const valid = { bigger: 10, smaller: 5 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  describe('equals condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .conditions({ smaller: { equals: 'bigger' } });

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must equal bigger.`
      });

      const valid = { bigger: 10, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('equal() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .equals('smaller', 'bigger');

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must equal bigger.`
      });

      const valid = { bigger: 10, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  describe('notEquals condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .conditions({ smaller: { notEquals: 'bigger' } });

      const invalid = { bigger: 10, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must not equal bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('equal() fail and verify', async () => {
      const object = validator
        .Object({ bigger: validator.Integer(), smaller: validator.Integer() })
        .notEquals('smaller', 'bigger');

      const invalid = { bigger: 10, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Must not equal bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  describe('xor condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({
          bigger: validator.Integer().required(false),
          smaller: validator.Integer().required(false)
        })
        .conditions({ smaller: { xor: 'bigger' } });

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Only bigger or smaller can be set.`
      });

      const valid = { smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('equal() fail and verify', async () => {
      const object = validator
        .Object({
          bigger: validator.Integer().required(false),
          smaller: validator.Integer().required(false)
        })
        .xor('smaller', 'bigger');

      const invalid = { bigger: 5, smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Only bigger or smaller can be set.`
      });

      const valid = { smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  describe('dependsOn condition', () => {
    it('conditions() fail and verify', async () => {
      const object = validator
        .Object({
          bigger: validator.Integer().required(false),
          smaller: validator.Integer().required(false)
        })
        .conditions({ smaller: { dependsOn: 'bigger' } });

      const invalid = { smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Depends on bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });

    it('equal() fail and verify', async () => {
      const object = validator
        .Object({
          bigger: validator.Integer().required(false),
          smaller: validator.Integer().required(false)
        })
        .dependsOn('smaller', 'bigger');

      const invalid = { smaller: 10 };
      await helper.throw(object.validate(invalid), {
        smaller: `Depends on bigger.`
      });

      const valid = { bigger: 5, smaller: 10 };
      const result = await object.validate(valid);
      result.should.deepEqual(valid);
    });
  });

  it('conditions with objects and array should skip', async () => {
    const object = validator
      .Object({
        bigger: validator.Object({ a: validator.Integer() }),
        smaller: validator.Object({ a: validator.Integer() })
      })
      .gt('bigger', 'smaller');

    const invalid = { bigger: { a: 5 }, smaller: { a: 5 } };
    let result = await object.validate(invalid);
    result.should.equal(invalid);

    const valid = { bigger: { a: 20 }, smaller: { a: 10 } };
    result = await object.validate(valid);
    result.should.equal(valid);
  });

  it('test multiple conditions', async () => {
    const object = validator
      .Object({
        bigger: validator.Integer().required(false),
        smaller: validator.Integer().required(false)
      })
      .gt('bigger', 'smaller')
      .dependsOn('bigger', 'smaller');

    const valid = { bigger: 10, smaller: 5 };
    const result = await object.validate(valid);
    result.should.equal(valid);
  });
});
