const should = require('should');
const helper = require('./helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Number()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator.Number()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator.Number()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  it('invalid type should fail', helper.mochaAsync(async () => {
    for (const value of ['10', 'test']) {
      const message = await helper.shouldThrow(async () => validator.Number().validate(value));
      message.should.equal(`Must be number but is ${typeof value}.`);
    }
  }));

  it('invalid value should fail', helper.mochaAsync(async () => {
    let message = await helper.shouldThrow(async () => validator.Number().min(10).validate(5));
    message.should.equal('Must be at minimum 10.');

    message = await helper.shouldThrow(async () => validator.Number().max(10).validate(15));
    message.should.equal('Must be at maximum 10.');
  }));

  it('valid value should verify', helper.mochaAsync(async () => {
    let value = await validator.Number().min(10).validate(15);
    value.should.equal(15);

    value = await validator.Number().max(20).validate(15);
    value.should.equal(15);
  }));

  it('parsed values should fail', helper.mochaAsync(async () => {
    const number = validator.Number({
      parseToType: true
    });
    for (const value of ['test', true]) {
      const message = await helper.shouldThrow(async () => number.validate(value));
      message.should.equal(`Must be number but is ${typeof value}.`);
    }
  }));

  it('parsed values should verify', helper.mochaAsync(async () => {
    const number = validator.Number({
      parseToType: true
    });

    const values = ['10', '-10', '0', '+20', '3.21312', '48120.2912'];
    const parsed = [10, -10, 0, 20, 3.21312, 48120.2912];

    for (const index in values) {
      const value = await number.validate(values[index]);
      value.should.equal(parsed[index]);
    }
  }));

  it('invalid default value should throw', helper.mochaAsync(async () => {
    const result = await helper.shouldThrow(async () => validator.Number().default('invalid'));
    result.message.should.equal('Must be number.');
  }));

  it('valid default value should verify', helper.mochaAsync(async () => {
    let result = await validator.Number().default(1.5).validate();
    result.should.equal(1.5);

    result = await validator.Number().default(1.3).validate(2);
    result.should.equal(2);
  }));

  it('test less function', helper.mochaAsync(async () => {
    let error;
    await validator.Number().less(1.3).validate(2.3).catch((err) => {
      error = err;
    });
    error.should.equal('Must be less than 1.3.');

    const result = await validator.Number().less(1.3).validate(0);
    result.should.equal(0);
  }));

  it('test greater function', helper.mochaAsync(async () => {
    let error;
    await validator.Number().greater(2.3).validate(1.3).catch((err) => {
      error = err;
    });
    error.should.equal('Must be greater than 2.3.');

    const result = await validator.Number().greater(2.3).validate(3.3);
    result.should.equal(3.3);
  }));

  it('test positive function', helper.mochaAsync(async () => {
    let error;
    await validator.Number().positive().validate(0).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a positive number.');

    error = undefined;
    await validator.Number().positive().validate(-1.3).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a positive number.');

    const result = await validator.Number().positive().validate(3.3);
    result.should.equal(3.3);
  }));

  it('test negative function', helper.mochaAsync(async () => {
    let error;
    await validator.Number().negative().validate(0).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a negative number.');

    error = undefined;
    await validator.Number().negative().validate(1.3).catch((err) => {
      error = err;
    });
    error.should.equal('Must be a negative number.');

    const result = await validator.Number().negative().validate(-3.3);
    result.should.equal(-3.3);
  }));

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator.Number()
        .default(2)
        .toObject();
      actual.should.deepEqual({
        type: 'number',
        default: 2,
        required: true
      });
    });

    it('should return object full description', async () => {
      const actual = validator.Number()
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
        type: 'number',
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
