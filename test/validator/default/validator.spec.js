const {
  ValidatorFactory
} = require('./../../../src/validator/default/validator');
const helper = require('./../../helper');
const { ValidationError } = require('./../../../src/utils/error');

describe('Validator()', () => {
  test('should create all types', () => {
    const validator = ValidatorFactory();

    expect(validator.Any().constructor.name).toBe('ANY');
    expect(validator.Array().constructor.name).toBe('ARRAY');
    expect(validator.Boolean().constructor.name).toBe('BOOLEAN');
    expect(validator.Date().constructor.name).toBe('DATE');
    expect(validator.Number().constructor.name).toBe('NUMBER');
    expect(validator.Object().constructor.name).toBe('OBJECT');
    expect(validator.String().constructor.name).toBe('STRING');
  });

  test('should add custom locale', () => {
    const validator = ValidatorFactory();

    validator.addLocale('custom', {});

    expect(validator._message._locales).toHaveProperty('custom');
  });

  test('should set locale', () => {
    const validator = ValidatorFactory();

    validator.setLocale('de');

    expect(validator._message.getLocale()).toBe('de');
  });

  test('should add custom type', () => {
    const validator = ValidatorFactory();
    const custom = validator.String();

    validator.addType('custom', custom);

    expect(validator._customs['custom']).toEqual(custom);
  });

  test('duplicate custom type should throw', () => {
    const validator = ValidatorFactory();
    const custom = validator.String();

    validator.addType('custom', custom);

    helper.shouldThrow(
      () => validator.addType('custom', custom),
      'Validator configuration error: Cannot add custom type. Name custom is already set.'
    );
  });

  test('invalid type should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.addType('custom', 'wrong'),
      'Validator configuration error: Cannot add custom type custom. Invalid type String.'
    );
  });

  test('should return custom type', () => {
    const validator = ValidatorFactory();

    const custom = validator.String();

    validator.addType('custom', custom);

    expect(validator.Custom('custom')).toEqual(custom);
  });

  test('unknown custom type should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.Custom('unknown'),
      'Validator configuration error: Error getting custom type unknown. Unknown type.'
    );
  });

  test('validateSync() with invalid schema should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.validateSync(undefined),
      'Validator configuration error: Invalid schema.'
    );
  });

  test('validateSync() with unknown schema should throw', () => {
    const validator = ValidatorFactory();

    helper.shouldThrow(
      () => validator.validateSync({}),
      'Validator configuration error: Unknown schema.'
    );
  });

  test('validateSync() should throw', () => {
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

  test('validateSync() should return error', () => {
    const validator = ValidatorFactory({ throwValidationErrors: false });

    const expected = new ValidationError(
      'Invalid input parameters and/or values.',
      'Required but is undefined.'
    );

    const actual = validator.validateSync(validator.String(), undefined);
    expect(actual).toEqual(expected);
  });

  test('validateSync() should verify', () => {
    const validator = ValidatorFactory();

    expect(validator.validateSync(validator.String(), 'test')).toBe('test');
  });

  test('validate() with invalid schema should throw', async () => {
    const validator = ValidatorFactory();

    await helper.shouldEventuallyThrow(
      validator.validate(undefined),
      'Validator configuration error: Invalid schema.'
    );
  });

  test('validate() with unknown schema should throw', async () => {
    const validator = ValidatorFactory();

    await helper.shouldEventuallyThrow(
      validator.validate({}),
      'Validator configuration error: Unknown schema.'
    );
  });

  test('validate() should throw', async () => {
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

  test('validate() should return error', async () => {
    const validator = ValidatorFactory({ throwValidationErrors: false });

    const expected = new ValidationError(
      'Invalid input parameters and/or values.',
      'Required but is undefined.'
    );

    const actual = await validator.validate(validator.String(), undefined);
    expect(actual).toEqual(expected);
  });

  test('validate() should verify', async () => {
    const validator = ValidatorFactory();

    const actual = await validator.validate(validator.String(), 'test');
    expect(actual).toBe('test');
  });

  test('listCustomTypes() should return array of custom type descriptions', async () => {
    const validator = ValidatorFactory();
    validator.addType('name', validator.String());
    validator.addType('age', validator.Number());

    expect(validator.listCustomTypes()).toEqual([
      'name: STRING',
      'age: NUMBER'
    ]);
  });
});
