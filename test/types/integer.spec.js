const should = require('should');
const helper = require('./helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Integer()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Integer()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Integer()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of ['10', 10.5]) {
      const message = await helper.shouldThrow(async () => validator.Integer().validate(value));
      message.should.equal(`Must be integer but is ${typeof value}.`);
    }
  }));

  it('valid type should verify', helper.mochaAsync(async () => {
    for (const value of [10, -20, 0, 1238412]) {
      const result = await validator.Integer().validate(value);
      result.should.equal(value);
    }
  }));

  it('invalid value should fail', helper.mochaAsync(async () => {
    let message = await helper.shouldThrow(async () => validator.Integer().min(10).validate(5));
    message.should.equal('Must be at minimum 10.');

    message = await helper.shouldThrow(async () => validator.Integer().max(10).validate(15));
    message.should.equal('Must be at maximum 10.');
  }));

  it('valid value should verify', helper.mochaAsync(async () => {
    let value = await validator.Integer().min(10).validate(15);
    value.should.equal(15);

    value = await validator.Integer().max(20).validate(15);
    value.should.equal(15);
  }));

  it('parsed values should fail', helper.mochaAsync(async () => {
    const integer = validator.Integer({
      parseToType: true
    });
    for (const value of ['10.0', true, '-0.9']) {
      const message = await helper.shouldThrow(async () => integer.validate(value));
      message.should.equal(`Must be integer but is ${typeof value}.`);
    }
  }));

  it('parsed values should verify', helper.mochaAsync(async () => {
    const integer = validator.Integer({
      parseToType: true
    });

    const values = ['10', '-10', '0', '+20'];
    const parsed = [10, -10, 0, 20];

    for (const index in values) {
      const value = await integer.validate(values[index]);
      value.should.equal(parsed[index]);
    }
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Integer().default('invalid'));
    result.message.should.equal('Must be integer.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await validator.Integer().default(1).validate();
    result.should.equal(1);

    result = await validator.Integer().default(1).validate(2);
    result.should.equal(2);
  }));

  it('test less function', helper.mochaAsync(async () => {
    let error;
    await validator.Integer().less(1).validate(2).catch((err) => {
      error = err;
    });
    error.should.equal('Must be less than 1.');

    const result = await validator.Integer().less(1).validate(0);
    result.should.equal(0);
  }));

  it('test greater function', helper.mochaAsync(async () => {
    let error;
    await validator.Integer().greater(2).validate(1).catch((err) => {
      error = err;
    });
    error.should.equal('Must be greater than 2.');

    const result = await validator.Integer().greater(2).validate(3);
    result.should.equal(3);
  }));

  it('test positive function', helper.mochaAsync(async () => {
    let error;
    await validator.Integer().positive().validate(0).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a positive integer.');

    error = undefined;
    await validator.Integer().positive().validate(-1).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a positive integer.');

    const result = await validator.Integer().positive().validate(3);
    result.should.equal(3);
  }));

  it('test negative function', helper.mochaAsync(async () => {
    let error;
    await validator.Integer().negative().validate(0).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a negative integer.');

    error = undefined;
    await validator.Integer().negative().validate(1).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a negative integer.');

    const result = await validator.Integer().negative().validate(-3);
    result.should.equal(-3);
  }));

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator.Integer()
        .default(2)
        .toObject();
      actual.should.deepEqual({
        type: 'integer',
        default: 2,
        required: true
      });
    });

    it('should return object full description', async () => {
      const actual = validator.Integer()
        .name('name')
        .description('description')
        .default(2)
        .example(2)
        .examples(2, 5)
        .required(true)
        .min(0)
        .max(0)
        .positive()
        .negative()
        .less(10)
        .greater(-5)
        .toObject();
      actual.should.deepEqual({
        type: 'integer',
        name: 'name',
        description: 'description',
        default: 2,
        example: 2,
        examples: [2, 5],
        required: true,
        min: 0,
        max: 0,
        positive: true,
        negative: true,
        less: 10,
        greater: -5
      });
    });
  });
});
