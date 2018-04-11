const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/number');
const { Message } = require('./../../../../src/utils/message');

chai.use(chaiAsPromised);
const should = chai.should();

describe('validation/number', () => {
  const message = Message('en');

  it('validateSync() required but undefined should throw', async () => {
    (() => validateSync(undefined, { message, required: true })).should.throw(
      'Required but is undefined.'
    );
  });

  it('validateSync() not required and undefined should verify', async () => {
    const value = validateSync(undefined, { message, required: false });
    should.equal(value, undefined);
  });

  it('validateSync() should return default value', async () => {
    validateSync(undefined, {
      message,
      required: true,
      defaultValue: 2.2
    }).should.equal(2.2);
  });

  it('validateSync() should return given value', async () => {
    validateSync(3.4, {
      message,
      required: true,
      defaultValue: 2.2
    }).should.equal(3.4);
  });
});
