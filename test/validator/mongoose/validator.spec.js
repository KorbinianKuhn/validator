const {
  MongooseValidatorFactory
} = require('./../../../src/validator/mongoose/validator');
const should = require('should');
const helper = require('./../../helper');
describe('MongooseValidator()', () => {
  const validator = MongooseValidatorFactory();

  it('should create all types', () => {
    validator.Any().constructor.name.should.equal('ANY_MONGOOSE');
    validator.Array().constructor.name.should.equal('ARRAY_MONGOOSE');
    validator.Boolean().constructor.name.should.equal('BOOLEAN_MONGOOSE');
    validator.Date().constructor.name.should.equal('DATE_MONGOOSE');
    validator.Number().constructor.name.should.equal('NUMBER_MONGOOSE');
    validator.Object().constructor.name.should.equal('OBJECT_MONGOOSE');
    validator.String().constructor.name.should.equal('STRING_MONGOOSE');
  });

  it('Any().validate() should verify', async () => {
    const actual = await validator.Any().validate()('test');
    should.equal(actual, 'test');
  });

  it('Any().validate() should fail', async () => {
    await helper.shouldEventuallyThrow(
      validator.Any().validate()(),
      'Required but is undefined.'
    );
  });

  it('Any().validateSync() should verify', () => {
    const actual = validator.Any().validateSync()('test');
    should.equal(actual, 'test');
  });

  it('Any().validateSync() should fail', () => {
    helper.shouldThrow(
      () => validator.Any().validateSync()(),
      'Required but is undefined.'
    );
  });

  it('Array().validate() should verify', async () => {
    const actual = await validator.Array().validate()(['test']);
    should.deepEqual(actual, ['test']);
  });

  it('Array().validate() should fail', async () => {
    await helper.shouldEventuallyThrow(
      validator.Array().validate()(),
      'Required but is undefined.'
    );
  });

  it('Array().validateSync() should verify', () => {
    const actual = validator.Array().validateSync()(['test']);
    should.deepEqual(actual, ['test']);
  });

  it('Array().validateSync() should fail', () => {
    helper.shouldThrow(
      () => validator.Array().validateSync()(),
      'Required but is undefined.'
    );
  });

  it('Boolean().validate() should verify', async () => {
    const actual = await validator.Boolean().validate()(true);
    should.equal(actual, true);
  });

  it('Boolean().validate() should fail', async () => {
    await helper.shouldEventuallyThrow(
      validator.Boolean().validate()(),
      'Required but is undefined.'
    );
  });

  it('Boolean().validateSync() should verify', () => {
    const actual = validator.Boolean().validateSync()(true);
    should.equal(actual, true);
  });

  it('Boolean().validateSync() should fail', () => {
    helper.shouldThrow(
      () => validator.Any().validateSync()(),
      'Required but is undefined.'
    );
  });

  it('Date().validate() should verify', async () => {
    const actual = await validator
      .Date()
      .parse(false)
      .validate()('2018-01-01T00:00:00.000Z');
    should.equal(actual, '2018-01-01T00:00:00.000Z');
  });

  it('Date().validate() should fail', async () => {
    await helper.shouldEventuallyThrow(
      validator.Date().validate()(),
      'Required but is undefined.'
    );
  });

  it('Date().validateSync() should verify', () => {
    const actual = validator
      .Date()
      .parse(false)
      .validateSync()('2018-01-01T00:00:00.000Z');
    should.equal(actual, '2018-01-01T00:00:00.000Z');
  });

  it('Date().validateSync() should fail', () => {
    helper.shouldThrow(
      () => validator.Any().validateSync()(),
      'Required but is undefined.'
    );
  });

  it('Number().validate() should verify', async () => {
    const actual = await validator.Number().validate()(2);
    should.equal(actual, 2);
  });

  it('Number().validate() should fail', async () => {
    await helper.shouldEventuallyThrow(
      validator.Number().validate()(),
      'Required but is undefined.'
    );
  });

  it('Number().validateSync() should verify', () => {
    const actual = validator.Number().validateSync()(2);
    should.equal(actual, 2);
  });

  it('Number().validateSync() should fail', () => {
    helper.shouldThrow(
      () => validator.Number().validateSync()(),
      'Required but is undefined.'
    );
  });

  it('Object().validate() should verify', async () => {
    const actual = await validator
      .Object()
      .empty(true)
      .validate()({});
    should.deepEqual(actual, {});
  });

  it('Object().validate() should fail', async () => {
    await helper.shouldEventuallyThrow(
      validator.Object().validate()(),
      'Required but is undefined.'
    );
  });

  it('Object().validateSync() should verify', () => {
    const actual = validator
      .Object()
      .empty(true)
      .validateSync()({});
    should.deepEqual(actual, {});
  });

  it('Object().validateSync() should fail', () => {
    helper.shouldThrow(
      () => validator.Object().validateSync()(),
      'Required but is undefined.'
    );
  });

  it('String().validate() should verify', async () => {
    const actual = await validator.String().validate()('test');
    should.equal(actual, 'test');
  });

  it('String().validate() should fail', async () => {
    await helper.shouldEventuallyThrow(
      validator.String().validate()(),
      'Required but is undefined.'
    );
  });

  it('String().validateSync() should verify', () => {
    const actual = validator.String().validateSync()('test');
    should.equal(actual, 'test');
  });

  it('String().validateSync() should fail', () => {
    helper.shouldThrow(
      () => validator.String().validateSync()(),
      'Required but is undefined.'
    );
  });
});
