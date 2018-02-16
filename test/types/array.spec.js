const should = require('should');
const helper = require('./helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe.skip('Array()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Array()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Array()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Array().validate(1234));
    result.should.equal('Must be array but is number.');
  }));

  it('valid type should verify', helper.mochaAsync(async () => {
    const value = await validator.Array().validate(['test']);
    should.deepEqual(value, ['test']);
  }));

  it('invalid length should fail', helper.mochaAsync(async () => {
    let result = await helper.shouldThrow(async () => validator.Array().min(5).validate(['test']));
    result.should.equal(`Must have at least 5 items.`);

    result = await helper.shouldThrow(async () => validator.Array().max(5).validate([1, 2, 3, 4, 5, 6]));
    result.should.equal(`Must have at most 5 items.`);

    result = await helper.shouldThrow(async () => validator.Array().length(3).validate(['test']));
    result.should.equal(`Must have exactly 3 items.`);
  }));

  it('valid length should verify', helper.mochaAsync(async () => {
    let value = await validator.Array().min(1).validate(['test']);
    value.should.deepEqual(['test']);

    value = await validator.Array().max(1).validate(['test']);
    value.should.deepEqual(['test']);

    value = await validator.Array().length(1).validate(['test']);
    value.should.deepEqual(['test']);
  }));

  it('array with invalid types should fail', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Array(validator.Integer()).validate(['test']));
    result.should.deepEqual({
      0: 'Must be integer but is string.'
    });
  }));

  it('array with valid types should verify', helper.mochaAsync(async () => {
    const value = await validator.Array(validator.Integer()).validate([1, 2, 3]);
    value.should.deepEqual([1, 2, 3]);
  }));

  it('empty array should fail', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Array().validate([]));
    result.should.equal('Array is empty.');
  }));

  it('empty array allowed should verify', helper.mochaAsync(async () => {
    let value = await validator.Array().empty(true).validate([]);
    value.should.deepEqual([]);

    value = await validator.Array({
      noEmptyArrays: false
    }).validate([]);
    value.should.deepEqual([]);
  }));

  it('parsed strings should verify', helper.mochaAsync(async () => {
    let result = await validator.Array().validate('a,b,c', {
      parseToType: true
    });

    result.should.deepEqual(['a', 'b', 'c']);

    result = await validator.Array().validate('["a","b","c"]', {
      parseToType: true
    });

    result.should.deepEqual(['a', 'b', 'c']);
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Array().default('invalid'));
    result.message.should.equal('Must be array.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await validator.Array().default([1, 2, 3]).validate();
    result.should.deepEqual([1, 2, 3]);

    result = await validator.Array().default([1, 2, 3]).validate([1, 2]);
    result.should.deepEqual([1, 2]);
  }));

  it('empty should verify', helper.mochaAsync(async () => {
    const promise = validator.Array(undefined, {
      noEmptyArrays: true
    }).empty(false).validate([]);

    await helper.throw(promise, 'Array is empty.');

    const result = await validator.Array(undefined, {
      noEmptyArrays: true
    }).empty(true).validate([]);
    result.should.deepEqual([]);
  }));

  it('duplicate items should fail', helper.mochaAsync(async () => {
    let result = await helper.shouldThrow(async () => validator.Array().unique(true).validate(['a', 'b', 'a']));
    result.should.equal('Values must be unique.');

    result = await helper.shouldThrow(async () => validator.Array(validator.Object({
      id: validator.Integer()
    })).unique(true).validate([{ id: 1 }, { id: 2 }, { id: 1 }]));
    result.should.equal('Values must be unique.');
  }));

  it('duplicate items should verify', helper.mochaAsync(async () => {
    let result = await await validator.Array().validate(['a', 'b', 'a']);
    result.should.deepEqual(['a', 'b', 'a']);

    const array = [{
      id: 1
    }, {
      id: 2
    }, {
      id: 1
    }];
    result = await validator.Array(validator.Object({
      id: validator.Integer()
    })).validate(array);
    result.should.deepEqual(array);
  }));

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator.Array()
        .default(2)
        .toObject();
      actual.should.deepEqual({
        type: 'array',
        default: 2,
        required: true
      });
    });

    it('should return object full description', async () => {
      const actual = validator.Array(validator.Any())
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
  });
});
