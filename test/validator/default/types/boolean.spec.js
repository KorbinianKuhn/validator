const {
  BooleanFactory
} = require('./../../../../src/validator/default/types/boolean');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/boolean', () => {
  const message = Message('en');

  test('BooleanFactory() should return BOOLEAN object', () => {
    expect(BooleanFactory().constructor.name).toBe('BOOLEAN');
  });

  test('options() should return options', () => {
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

    expect(schema.options({ validation: true })).toEqual({
      defaultValue,
      allowed,
      func,
      not,
      only,
      parse,
      required: false,
      message
    });

    expect(schema.options()).toEqual({
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

  test('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';

    const schema = BooleanFactory()
      .description(description)
      .example(example)
      .required();

    expect(schema.toObject()).toEqual({
      type: 'boolean',
      description,
      example,
      required: true,
      parse: false
    });
  });

  test('validateSync() should verify', () => {
    expect(BooleanFactory().validateSync(true)).toBe(true);
  });

  test('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        BooleanFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  test('validateAsync() should verify', async () => {
    await BooleanFactory()
      .validate(false)
      .then(value => {
        expect(value).toBe(false);
      });
  });

  test('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      BooleanFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });
});
