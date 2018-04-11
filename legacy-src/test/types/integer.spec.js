const should = require('should');
const helper = require('../helper');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Integer()', () => {
  describe('required()', () => {
    it('undefined should throw', async () => {
      const promise = validator
        .Integer()
        .required(true)
        .validate();
      await helper.throw(promise, 'Required but is undefined.');
    });

    it('undefined should verify', async () => {
      const actual = await validator
        .Integer()
        .required(false)
        .validate();
      should.equal(actual, undefined);
    });
  });

  describe('validate()', () => {
    it('invalid type should fail', async () => {
      for (const value of ['10', 10.5]) {
        await helper.throw(
          validator
            .Integer()
            .parse(false)
            .validate(value),
          `Must be integer but is ${typeof value}.`
        );
      }
    });

    it('valid type should verify', async () => {
      for (const value of [10, -20, 0, 1238412]) {
        const result = await validator.Integer().validate(value);
        result.should.equal(value);
      }
    });
  });

  describe('min()', () => {
    it('invalid value should fail', async () => {
      await helper.throw(
        validator
          .Integer()
          .min(10)
          .validate(5),
        'Must be at minimum 10.'
      );
    });

    it('valid value should verify', async () => {
      const value = await validator
        .Integer()
        .min(10)
        .validate(15);
      value.should.equal(15);
    });
  });

  describe('max()', () => {
    it('invalid value should fail', async () => {
      await helper.throw(
        validator
          .Integer()
          .max(10)
          .validate(15),
        'Must be at maximum 10.'
      );
    });

    it('valid value should verify', async () => {
      const value = await validator
        .Integer()
        .max(20)
        .validate(15);
      value.should.equal(15);
    });
  });

  describe('parse()', () => {
    it('parsed values should fail', async () => {
      const integer = validator.Integer().parse(true);
      for (const value of ['10.0', true, '-0.9']) {
        await helper.throw(
          integer.validate(value),
          `Must be integer but is ${typeof value}.`
        );
      }
    });

    it('parsed values should verify', async () => {
      const integer = validator.Integer().parse(true);

      const values = ['10', '-10', '0', '+20'];
      const parsed = [10, -10, 0, 20];

      for (const index in values) {
        const value = await integer.validate(values[index]);
        value.should.equal(parsed[index]);
      }
    });
  });

  describe('default()', () => {
    it('invalid default value should throw', async () => {
      await helper.throw(
        () => validator.Integer().default('invalid'),
        'Must be integer.'
      );
    });

    it('should return default value', async () => {
      const result = await validator
        .Integer()
        .default(1)
        .validate();
      result.should.equal(1);
    });

    it('should return value', async () => {
      const result = await validator
        .Integer()
        .default(1)
        .validate(2);
      result.should.equal(2);
    });
  });

  describe('less()', () => {
    it('test less function', async () => {
      helper.throw(
        validator
          .Integer()
          .less(1)
          .validate(2),
        'Must be less than 1.'
      );

      const result = await validator
        .Integer()
        .less(1)
        .validate(0);
      result.should.equal(0);
    });
  });

  describe('greater()', () => {
    it('test greater function', async () => {
      helper.throw(
        validator
          .Integer()
          .greater(2)
          .validate(1),
        'Must be greater than 2.'
      );

      const result = await validator
        .Integer()
        .greater(2)
        .validate(3);
      result.should.equal(3);
    });
  });

  describe('positive()', () => {
    it('test positive function', async () => {
      helper.throw(
        validator
          .Integer()
          .positive()
          .validate(0),
        'Must be a positive integer.'
      );
      helper.throw(
        validator
          .Integer()
          .positive()
          .validate(-1),
        'Must be a positive integer.'
      );

      const result = await validator
        .Integer()
        .positive()
        .validate(3);
      result.should.equal(3);
    });
  });

  describe('negative()', () => {
    it('test negative function', async () => {
      helper.throw(
        validator
          .Integer()
          .negative()
          .validate(0),
        'Must be a negative integer.'
      );
      helper.throw(
        validator
          .Integer()
          .negative()
          .validate(1),
        'Must be a negative integer.'
      );

      const result = await validator
        .Integer()
        .negative()
        .validate(-3);
      result.should.equal(-3);
    });
  });

  describe('toObject()', () => {
    it('should return object small description', async () => {
      const actual = validator
        .Integer()
        .default(2)
        .toObject();
      actual.should.deepEqual({
        type: 'integer',
        default: 2,
        required: true
      });
    });

    it('should return object full description', async () => {
      const actual = validator
        .Integer()
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

    it('type raml should verify', async () => {
      const object = validator.Integer().toObject({ type: 'raml' });
      object.should.be.type('object');
    });
  });
});
