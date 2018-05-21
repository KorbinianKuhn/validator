const {
  ValidatorFactory
} = require('./../../../src/validator/default/validator');
const helper = require('./../../helper');
const { ValidationError } = require('./../../../src/utils/error');

describe('Validator()', () => {
  it('should create all types', () => {
    const validator = ValidatorFactory();

    validator.Any().constructor.name.should.equal('ANY');
    validator.Array().constructor.name.should.equal('ARRAY');
    validator.Boolean().constructor.name.should.equal('BOOLEAN');
    validator.Date().constructor.name.should.equal('DATE');
    validator.Number().constructor.name.should.equal('NUMBER');
    validator.Object().constructor.name.should.equal('OBJECT');
    validator.String().constructor.name.should.equal('STRING');
  });

  it('should add custom locale', () => {
    const validator = ValidatorFactory();

    validator.addLocale('custom', {});

    validator._message._locales.should.have.property('custom');
  });

  it('should set locale', () => {
    const validator = ValidatorFactory();

    validator.setLocale('de');

    validator._message.getLocale().should.equal('de');
  });

  it('should add custom type', () => {
    const validator = ValidatorFactory();
    const custom = validator.String();

    validator.addType('custom', custom);

    validator._customs['custom'].should.deepEqual(custom);
  });

  it('duplicate custom type should throw', () => {
    const validator = ValidatorFactory();
    const custom = validator.String();

    validator.addType('custom', custom);

    helper.shouldThrow(
      () => validator.addType('custom', custom),
      'Validator configuration error: Cannot add custom type. Name custom is already set.'
    );
  });

  it('invalid type should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.addType('custom', 'wrong'),
      'Validator configuration error: Cannot add custom type custom. Invalid type String.'
    );
  });

  it('should return custom type', () => {
    const validator = ValidatorFactory();

    const custom = validator.String();

    validator.addType('custom', custom);

    validator.Custom('custom').should.deepEqual(custom);
  });

  it('unknown custom type should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.Custom('unknown'),
      'Validator configuration error: Error getting custom type unknown. Unknown type.'
    );
  });

  it('validateSync() with invalid schema should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.validateSync(undefined),
      'Validator configuration error: Invalid schema.'
    );
  });

  it('validateSync() with unknown schema should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.validateSync({}),
      'Validator configuration error: Unknown schema.'
    );
  });

  it('validateSync() should throw', () => {
    const validator = ValidatorFactory();

    const expected = new ValidationError(
      'Invalid input parameters and/or values.',
      'Required but is undefined.'
    );

    helper.shouldThrow(
      () => validator.validateSync(validator.String(), undefined),
      expected
    );
  });

  it('validateSync() should return error', () => {
    const validator = ValidatorFactory({ throwValidationErrors: false });

    const expected = new ValidationError(
      'Invalid input parameters and/or values.',
      'Required but is undefined.'
    );

    const actual = validator.validateSync(validator.String(), undefined);
    actual.should.deepEqual(expected);
  });

  it('validateSync() should verify', () => {
    const validator = ValidatorFactory();

    validator.validateSync(validator.String(), 'test').should.equal('test');
  });

  it('validate() with invalid schema should throw', async () => {
    const validator = ValidatorFactory();

    await helper.shouldEventuallyThrow(
      validator.validate(undefined),
      'Validator configuration error: Invalid schema.'
    );
  });

  it('validate() with unknown schema should throw', async () => {
    const validator = ValidatorFactory();

    await helper.shouldEventuallyThrow(
      validator.validate({}),
      'Validator configuration error: Unknown schema.'
    );
  });

  it('validate() should throw', async () => {
    const validator = ValidatorFactory();

    const expected = new ValidationError(
      'Invalid input parameters and/or values.',
      'Required but is undefined.'
    );

    await helper.shouldEventuallyThrow(
      validator.validate(validator.String(), undefined),
      expected
    );
  });

  it('validate() should return error', async () => {
    const validator = ValidatorFactory({ throwValidationErrors: false });

    const expected = new ValidationError(
      'Invalid input parameters and/or values.',
      'Required but is undefined.'
    );

    const actual = await validator.validate(validator.String(), undefined);
    actual.should.deepEqual(expected);
  });

  it('validate() should verify', async () => {
    const validator = ValidatorFactory();

    const actual = await validator.validate(validator.String(), 'test');
    actual.should.equal('test');
  });

  it('listCustomTypes() should return array of custom type descriptions', async () => {
    const validator = ValidatorFactory();
    validator.addType('name', validator.String());
    validator.addType('age', validator.Number());

    validator
      .listCustomTypes()
      .should.deepEqual(['name: STRING', 'age: NUMBER']);
  });
});
