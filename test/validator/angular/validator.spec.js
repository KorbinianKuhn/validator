const {
  AngularValidatorFactory
} = require('./../../../src/validator/angular/validator');

describe('AngularValidator()', () => {
  const validator = AngularValidatorFactory();

  test('should create all types', () => {
    expect(validator.Any().constructor.name).toBe('ANY_ANGULAR');
    expect(validator.Array().constructor.name).toBe('ARRAY_ANGULAR');
    expect(validator.Boolean().constructor.name).toBe('BOOLEAN_ANGULAR');
    expect(validator.Date().constructor.name).toBe('DATE_ANGULAR');
    expect(validator.Number().constructor.name).toBe('NUMBER_ANGULAR');
    expect(validator.Object().constructor.name).toBe('OBJECT_ANGULAR');
    expect(validator.String().constructor.name).toBe('STRING_ANGULAR');
  });

  test('Any().validate() should verify', async () => {
    const actual = await validator.Any().validate()({ value: 'test' });
    expect(actual).toBe(null);
  });

  test('Any().validate() should fail', async () => {
    const actual = await validator.Any().validate()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Any().validateSync() should verify', () => {
    const actual = validator.Any().validateSync()({ value: 'test' });
    expect(actual).toBe(null);
  });

  test('Any().validateSync() should fail', () => {
    const actual = validator.Any().validateSync()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Array().validate() should verify', async () => {
    const actual = await validator.Array().validate()({ value: 'test' });
    expect(actual).toBe(null);
  });

  test('Array().validate() should fail', async () => {
    const actual = await validator.Array().validate()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Array().validateSync() should verify', () => {
    const actual = validator.Array().validateSync()({ value: 'test' });
    expect(actual).toBe(null);
  });

  test('Array().validateSync() should fail', () => {
    const actual = validator.Array().validateSync()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Boolean().validate() should verify', async () => {
    const actual = await validator.Boolean().validate()({ value: true });
    expect(actual).toBe(null);
  });

  test('Boolean().validate() should fail', async () => {
    const actual = await validator.Boolean().validate()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Boolean().validateSync() should verify', () => {
    const actual = validator.Boolean().validateSync()({ value: true });
    expect(actual).toBe(null);
  });

  test('Boolean().validateSync() should fail', () => {
    const actual = validator.Boolean().validateSync()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Date().validate() should verify', async () => {
    const actual = await validator.Date().validate()({
      value: '2018-01-01T00:00:00.000Z'
    });
    expect(actual).toBe(null);
  });

  test('Date().validate() should fail', async () => {
    const actual = await validator.Date().validate()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Date().validateSync() should verify', () => {
    const actual = validator.Date().validateSync()({
      value: '2018-01-01T00:00:00.000Z'
    });
    expect(actual).toBe(null);
  });

  test('Date().validateSync() should fail', () => {
    const actual = validator.Date().validateSync()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Number().validate() should verify', async () => {
    const actual = await validator.Number().validate()({ value: 2 });
    expect(actual).toBe(null);
  });

  test('Number().validate() should fail', async () => {
    const actual = await validator.Number().validate()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Number().validateSync() should verify', () => {
    const actual = validator.Number().validateSync()({ value: 2 });
    expect(actual).toBe(null);
  });

  test('Number().validateSync() should fail', () => {
    const actual = validator.Number().validateSync()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Object().validate() should verify', async () => {
    const actual = await validator
      .Object()
      .empty(true)
      .validate()({ value: {} });
    expect(actual).toBe(null);
  });

  test('Object().validate() should fail', async () => {
    const actual = await validator.Object().validate()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('Object().validateSync() should verify', () => {
    const actual = validator
      .Object()
      .empty(true)
      .validateSync()({ value: {} });
    expect(actual).toBe(null);
  });

  test('Object().validateSync() should fail', () => {
    const actual = validator.Object().validateSync()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('String().validate() should verify', async () => {
    const actual = await validator.String().validate()({ value: 'test' });
    expect(actual).toBe(null);
  });

  test('String().validate() should fail', async () => {
    const actual = await validator.String().validate()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });

  test('String().validateSync() should verify', () => {
    const actual = validator.String().validateSync()({ value: 'test' });
    expect(actual).toBe(null);
  });

  test('String().validateSync() should fail', () => {
    const actual = validator.String().validateSync()({ value: '' });
    expect(actual).toEqual({ validation: 'Required but is undefined.' });
  });
});
