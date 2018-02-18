const should = require('should');
const helper = require('../helper');
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

  it('invalid type should fail', async () => {
    for (const value of ['10', 'test']) {
      await helper.throw(validator.Number().parse(false).validate(value), `Must be number but is ${typeof value}.`);
    }
  });

  it('invalid value should fail', async () => {
    await helper.throw(validator.Number().min(10).validate(5), 'Must be at minimum 10.');
    await helper.throw(validator.Number().max(10).validate(15), 'Must be at maximum 10.');
  });

  it('valid value should verify', async () => {
    let value = await validator.Number().min(10).validate(15);
    value.should.equal(15);

    value = await validator.Number().max(20).validate(15);
    value.should.equal(15);
  });

  it('parsed values should fail', async () => {
    const number = validator.Number({
      parseToType: true
    });
    for (const value of ['test', true]) {
      await helper.throw(number.validate(value), `Must be number but is ${typeof value}.`);
    }
  });

  it('parsed values should verify', async () => {
    const number = validator.Number().parse(true);

    const values = ['10', '-10', '0', '+20', '3.21312', '48120.2912'];
    const parsed = [10, -10, 0, 20, 3.21312, 48120.2912];

    for (const index in values) {
      const value = await number.validate(values[index]);
      value.should.equal(parsed[index]);
    }
  });

  it('invalid default value should throw', async () => {
    await helper.throw(() => validator.Number().default('invalid'), 'Must be number.');
  });

  it('valid default value should verify', async () => {
    let result = await validator.Number().default(1.5).validate();
    result.should.equal(1.5);

    result = await validator.Number().default(1.3).validate(2);
    result.should.equal(2);
  });

  it('test less function', async () => {
    helper.throw(validator.Number().less(1.3).validate(2.3), 'Must be less than 1.3.');

    const result = await validator.Number().less(1.3).validate(0);
    result.should.equal(0);
  });

  it('test greater function', async () => {
    helper.throw(validator.Number().greater(2.3).validate(1.3), 'Must be greater than 2.3.');

    const result = await validator.Number().greater(2.3).validate(3.3);
    result.should.equal(3.3);
  });

  it('test positive function', async () => {
    helper.throw(validator.Number().positive().validate(0), 'Must be a positive number.');
    helper.throw(validator.Number().positive().validate(-1.3), 'Must be a positive number.');

    const result = await validator.Number().positive().validate(3.3);
    result.should.equal(3.3);
  });

  it('test negative function', async () => {
    helper.throw(validator.Number().negative().validate(0), 'Must be a negative number.');
    helper.throw(validator.Number().negative().validate(1.3), 'Must be a negative number.');

    const result = await validator.Number().negative().validate(-3.3);
    result.should.equal(-3.3);
  });

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

    it('type raml should verify', async () => {
      const object = validator.Number().toObject({ type: 'raml' });
      object.should.be.type('object');
    });
  });
});
