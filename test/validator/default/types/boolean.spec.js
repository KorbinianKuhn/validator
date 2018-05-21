const {
  BooleanFactory
} = require('./../../../../src/validator/default/types/boolean');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/boolean', () => {
  const message = Message('en');

  it('BooleanFactory() should return BOOLEAN object', () => {
    BooleanFactory().constructor.name.should.equal('BOOLEAN');
  });

  it('options() should return options', () => {
    const func = () => {};
    const defaultValue = true;
    const allowed = [null];
    const not = ['not'];
    const only = ['only'];
    const parse = false;
    const description = 'description';
    const example = 'example';

    const schema = BooleanFactory()
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .func(func);

    schema.options({ validation: true }).should.deepEqual({
      defaultValue,
      allowed,
      func,
      not,
      only,
      parse,
      required: false,
      message
    });

    schema.options().should.deepEqual({
      type: 'boolean',
      description,
      example,
      default: defaultValue,
      allowed,
      not,
      only,
      parse,
      required: false
    });
  });

  it('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';

    const schema = BooleanFactory()
      .description(description)
      .example(example)
      .required();

    schema.toObject().should.deepEqual({
      type: 'boolean',
      description,
      example,
      required: true,
      parse: false
    });
  });

  it('validateSync() should verify', () => {
    BooleanFactory()
      .validateSync(true)
      .should.equal(true);
  });

  it('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        BooleanFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  it('validateAsync() should verify', async () => {
    await BooleanFactory()
      .validate(false)
      .then(value => {
        value.should.equal(false);
      });
  });

  it('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      BooleanFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });
});
