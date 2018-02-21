const Validator = require('./../../index').AngularValidator;
const should = require('should');

const validator = Validator();

describe('AngularValidator()', () => {
  it('constructor()', () => {
    validator._options.type.should.equal('angular');
    validator._options.messages.should.equal('angular');
  });

  it('all types should be created with the validator', () => {
    validator.Any().constructor.name.should.equal('ANY_ANGULAR');
    validator.Array().constructor.name.should.equal('ARRAY_ANGULAR');
    validator.Boolean().constructor.name.should.equal('BOOLEAN_ANGULAR');
    validator.Date().constructor.name.should.equal('DATE_ANGULAR');
    validator.Enum([]).constructor.name.should.equal('ENUM_ANGULAR');
    validator.Function(() => {}).constructor.name.should.equal('FUNCTION_ANGULAR');
    validator.Integer().constructor.name.should.equal('INTEGER_ANGULAR');
    validator.Number().constructor.name.should.equal('NUMBER_ANGULAR');
    validator.Object({}).constructor.name.should.equal('OBJECT_ANGULAR');
    validator.Regex(/A-Z/).constructor.name.should.equal('REGEX_ANGULAR');
    validator.String().constructor.name.should.equal('STRING_ANGULAR');
  });

  describe('Any()', () => {
    it('should verify', async () => {
      const value = await validator.Any().validate()({ value: 'test' });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Any().validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Array()', () => {
    it('should verify', async () => {
      const value = await validator.Array().validate()({ value: 'test' });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Array().validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Boolean()', () => {
    it('should verify', async () => {
      const value = await validator.Boolean().validate()({ value: true });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Boolean().validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Date()', () => {
    it('should verify', async () => {
      const value = await validator.Date().validate()({ value: new Date().toISOString() });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Date().validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Enum()', () => {
    it('should verify', async () => {
      const value = await validator.Enum(['a', 'b']).validate()({ value: 'a' });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Enum(['a', 'b']).validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Function()', () => {
    it('should verify', async () => {
      const func = async value => value;
      const value = await validator.Function(func).validate()({ value: 'test' });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const func = async () => { throw new Error('test'); };
      const value = await validator.Function(func).validate()({ value: 'test' });
      value.should.deepEqual({ validation: 'test' });
    });
  });

  describe('Integer()', () => {
    it('should verify', async () => {
      const value = await validator.Integer().validate()({ value: 2 });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Integer().validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Number()', () => {
    it('should verify', async () => {
      const value = await validator.Number().validate()({ value: 2 });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Number().validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Object()', () => {
    it('should verify', async () => {
      const value = await validator.Object({}).empty(true).validate()({ value: {} });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Object({}).empty(true).validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('Regex()', () => {
    it('should verify', async () => {
      const value = await validator.Regex(/[A-Z]/).validate()({ value: 'ABC' });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.Regex(/[A-Z]/).validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });

  describe('String()', () => {
    it('should verify', async () => {
      const value = await validator.String().validate()({ value: 'test' });
      should.equal(value, null);
    });

    it('should fail', async () => {
      const value = await validator.String().validate()({ });
      value.should.deepEqual({ validation: 'This field is required.' });
    });
  });
});
