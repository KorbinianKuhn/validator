const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Validator } = require('./../../../../index');

chai.use(chaiAsPromised);

describe('Number()', () => {
  const validator = Validator();

  it('validate() should verify', async () => {
    await validator
      .Number()
      .validate(2)
      .should.eventually.equal(2);
  });

  it('validateSync() should verify', async () => {
    validator
      .Number()
      .validateSync(2)
      .should.equal(2);
  });

  it('toObject() should contain all settings', async () => {
    const actual = validator
      .Number()
      .default(2)
      .description('description')
      .example(3)
      .parse(false)
      .required(false)
      .integer()
      .min(0)
      .max(2)
      .positive()
      .negative()
      .less(5)
      .greater(-1)
      .toObject();
    const expected = {
      type: 'number',
      integer: true,
      default: 2,
      description: 'description',
      example: 3,
      parse: false,
      required: false,
      min: 0,
      max: 2,
      positive: true,
      negative: true,
      less: 5,
      greater: -1
    };
    actual.should.deep.equal(expected);
  });
});
