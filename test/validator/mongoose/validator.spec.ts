import { SchemaMongoose } from './../../../src/validator/mongoose';
import { shouldThrow, shouldEventuallyThrow } from './../../helper';

describe('SchemaMongoose()', () => {
  const validator = new SchemaMongoose();

  test('should create all types', () => {
    expect(validator.Any().constructor.name).toBe('AnySchemaMongoose');
    expect(validator.Array().constructor.name).toBe('ArraySchemaMongoose');
    expect(validator.Boolean().constructor.name).toBe('BooleanSchemaMongoose');
    expect(validator.Date().constructor.name).toBe('DateSchemaMongoose');
    expect(validator.Number().constructor.name).toBe('NumberSchemaMongoose');
    expect(validator.Object().constructor.name).toBe('ObjectSchemaMongoose');
    expect(validator.String().constructor.name).toBe('StringSchemaMongoose');
  });

  test('Any().validate() should verify', async () => {
    const actual = await validator.Any().validate()('test');
    expect(actual).toBe('test');
  });

  test('Any().validate() should fail', async () => {
    await shouldEventuallyThrow(validator.Any().validate()(), 'Required but is undefined.');
  });

  test('Any().validateSync() should verify', () => {
    const actual = validator.Any().validateSync()('test');
    expect(actual).toBe('test');
  });

  test('Any().validateSync() should fail', () => {
    shouldThrow(() => validator.Any().validateSync()(), 'Required but is undefined.');
  });

  test('Array().validate() should verify', async () => {
    const actual = await validator.Array().validate()(['test']);
    expect(actual).toEqual(['test']);
  });

  test('Array().validate() should fail', async () => {
    await shouldEventuallyThrow(validator.Array().validate()(), 'Required but is undefined.');
  });

  test('Array().validateSync() should verify', () => {
    const actual = validator.Array().validateSync()(['test']);
    expect(actual).toEqual(['test']);
  });

  test('Array().validateSync() should fail', () => {
    shouldThrow(() => validator.Array().validateSync()(), 'Required but is undefined.');
  });

  test('Boolean().validate() should verify', async () => {
    const actual = await validator.Boolean().validate()(true);
    expect(actual).toBe(true);
  });

  test('Boolean().validate() should fail', async () => {
    await shouldEventuallyThrow(validator.Boolean().validate()(), 'Required but is undefined.');
  });

  test('Boolean().validateSync() should verify', () => {
    const actual = validator.Boolean().validateSync()(true);
    expect(actual).toBe(true);
  });

  test('Boolean().validateSync() should fail', () => {
    shouldThrow(() => validator.Any().validateSync()(), 'Required but is undefined.');
  });

  test('Date().validate() should verify', async () => {
    const actual = await validator
      .Date()
      .parse(false)
      .validate()('2018-01-01T00:00:00.000Z');
    expect(actual).toBe('2018-01-01T00:00:00.000Z');
  });

  test('Date().validate() should fail', async () => {
    await shouldEventuallyThrow(validator.Date().validate()(), 'Required but is undefined.');
  });

  test('Date().validateSync() should verify', () => {
    const actual = validator
      .Date()
      .parse(false)
      .validateSync()('2018-01-01T00:00:00.000Z');
    expect(actual).toBe('2018-01-01T00:00:00.000Z');
  });

  test('Date().validateSync() should fail', () => {
    shouldThrow(() => validator.Any().validateSync()(), 'Required but is undefined.');
  });

  test('Number().validate() should verify', async () => {
    const actual = await validator.Number().validate()(2);
    expect(actual).toBe(2);
  });

  test('Number().validate() should fail', async () => {
    await shouldEventuallyThrow(validator.Number().validate()(), 'Required but is undefined.');
  });

  test('Number().validateSync() should verify', () => {
    const actual = validator.Number().validateSync()(2);
    expect(actual).toBe(2);
  });

  test('Number().validateSync() should fail', () => {
    shouldThrow(() => validator.Number().validateSync()(), 'Required but is undefined.');
  });

  test('Object().validate() should verify', async () => {
    const actual = await validator
      .Object()
      .empty(true)
      .validate()({});
    expect(actual).toEqual({});
  });

  test('Object().validate() should fail', async () => {
    await shouldEventuallyThrow(validator.Object().validate()(), 'Required but is undefined.');
  });

  test('Object().validateSync() should verify', () => {
    const actual = validator
      .Object()
      .empty(true)
      .validateSync()({});
    expect(actual).toEqual({});
  });

  test('Object().validateSync() should fail', () => {
    shouldThrow(() => validator.Object().validateSync()(), 'Required but is undefined.');
  });

  test('String().validate() should verify', async () => {
    const actual = await validator.String().validate()('test');
    expect(actual).toBe('test');
  });

  test('String().validate() should fail', async () => {
    await shouldEventuallyThrow(validator.String().validate()(), 'Required but is undefined.');
  });

  test('String().validateSync() should verify', () => {
    const actual = validator.String().validateSync()('test');
    expect(actual).toBe('test');
  });

  test('String().validateSync() should fail', () => {
    shouldThrow(() => validator.String().validateSync()(), 'Required but is undefined.');
  });
});
