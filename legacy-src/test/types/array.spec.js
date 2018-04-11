const should = require('should');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Array()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator
        .Array()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator
        .Array()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', async () => {
    await helper.throw(
      validator.Array().validate(1234),
      'Must be array but is number.'
    );
  });

  it('valid type should verify', async () => {
    const value = await validator.Array().validate(['test']);
    should.deepEqual(value, ['test']);
  });

  describe('min()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(
        validator
          .Array()
          .min(5)
          .validate(['test']),
        `Must have at least 5 items.`
      );
    });

    it('valid length should verify', async () => {
      const value = await validator
        .Array()
        .min(1)
        .validate(['test']);
      value.should.deepEqual(['test']);
    });
  });

  describe('max()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(
        validator
          .Array()
          .max(5)
          .validate([1, 2, 3, 4, 5, 6]),
        `Must have at most 5 items.`
      );
    });

    it('valid length should verify', async () => {
      const value = await validator
        .Array()
        .max(1)
        .validate(['test']);
      value.should.deepEqual(['test']);
    });
  });

  describe('length()', () => {
    it('invalid length should fail', async () => {
      await helper.throw(
        validator
          .Array()
          .length(3)
          .validate(['test']),
        `Must have exactly 3 items.`
      );
    });

    it('valid length should verify', async () => {
      const value = await validator
        .Array()
        .length(1)
        .validate(['test']);
      value.should.deepEqual(['test']);
    });
  });

  it('array with invalid types should fail', async () => {
    await helper.throw(
      validator.Array(validator.Integer()).validate(['test']),
      {
        0: 'Must be integer but is string.'
      }
    );
  });

  it('array with valid types should verify', async () => {
    const value = await validator
      .Array(validator.Integer())
      .validate([1, 2, 3]);
    value.should.deepEqual([1, 2, 3]);
  });

  describe('empty()', () => {
    it('empty array should fail', async () => {
      await helper.throw(validator.Array().validate([]), 'Array is empty.');
    });

    it('empty array should verify', async () => {
      const value = await validator
        .Array()
        .empty(true)
        .validate([]);
      value.should.deepEqual([]);
    });
  });

  describe('parse()', () => {
    it('comma separated should verify', async () => {
      const result = await validator
        .Array()
        .parse(true)
        .validate('a,b,c');
      result.should.deepEqual(['a', 'b', 'c']);
    });

    it('json should verify', async () => {
      const result = await validator
        .Array()
        .parse(true)
        .validate('["a","b","c"]');
      result.should.deepEqual(['a', 'b', 'c']);
    });
  });

  describe('default()', () => {
    it('invalid default value should throw', async () => {
      const func = () => validator.Array().default('invalid');
      await helper.throw(func, 'Must be array.');
    });

    it('valid default value should verify', async () => {
      const result = await validator
        .Array()
        .default([1, 2, 3])
        .validate();
      result.should.deepEqual([1, 2, 3]);
    });

    it('valid default value should return value', async () => {
      const result = await validator
        .Array()
        .default([1, 2, 3])
        .validate([1, 2]);
      result.should.deepEqual([1, 2]);
    });
  });

  describe('empty()', () => {
    it('empty should throw', async () => {
      await helper.throw(
        validator
          .Array()
          .empty(false)
          .validate([]),
        'Array is empty.'
      );
    });

    it('empty should verify', async () => {
      const result = await validator
        .Array()
        .empty(true)
        .validate([]);
      result.should.deepEqual([]);
    });
  });

  describe('unique()', () => {
    it('duplicate items should fail', async () => {
      await helper.throw(
        validator
          .Array()
          .unique(true)
          .validate(['a', 'b', 'a']),
        'Values must be unique.'
      );
    });

    it('duplicate objects should fail', async () => {
      const promise = validator
        .Array(
          validator.Object({
            id: validator.Integer()
          })
        )
        .unique(true)
        .validate([{ id: 1 }, { id: 2 }, { id: 1 }]);
      await helper.throw(promise, 'Values must be unique.');
    });

    it('duplicate items should verify', async () => {
      let result = await await validator.Array().validate(['a', 'b', 'a']);
      result.should.deepEqual(['a', 'b', 'a']);

      const array = [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 1
        }
      ];
      result = await validator
        .Array(
          validator.Object({
            id: validator.Integer()
          })
        )
        .validate(array);
      result.should.deepEqual(array);
    });
  });

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator
        .Array()
        .default([2])
        .toObject();
      actual.should.deepEqual({
        type: 'array',
        default: [2],
        required: true,
        empty: false
      });
    });

    it('should return object full description', async () => {
      const actual = validator
        .Array(validator.Any())
        .name('name')
        .description('description')
        .default([2])
        .example(2)
        .examples(2, 5)
        .required(true)
        .min(0)
        .max(0)
        .unique(true)
        .empty(false)
        .toObject();
      actual.should.deepEqual({
        type: 'array',
        name: 'name',
        description: 'description',
        default: [2],
        example: 2,
        examples: [2, 5],
        required: true,
        min: 0,
        max: 0,
        unique: true,
        empty: false,
        items: validator.Any().toObject()
      });
    });

    it('type raml should verify', async () => {
      const object = validator.Array().toObject({ type: 'raml' });
      object.should.be.type('object');
    });
  });
});
