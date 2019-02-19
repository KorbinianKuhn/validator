const { AnyFactory } = require('./../../../../src/validator/default/types/any');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/any', () => {
  const message = Message('en');

  test('AnyFactory() should return ANY object', () => {
    expect(AnyFactory().constructor.name).toBe('ANY');
  });

  test('options() should return options', () => {
    const func = () => {};
    const defaultValue = 'default';
    const allowed = [null];
    const not = ['not'];
    const only = ['only'];
    const parse = false;
    const description = 'description';
    const example = 'example';

    const schema = AnyFactory()
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
      message,
      nullAsUndefined: false
    });

    expect(schema.options()).toEqual({
      type: 'any',
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

  test('func() with invalid argument should fail', () => {
    helper.shouldThrow(
      () => AnyFactory().func('wrong'),
      'Validator configuration error: Must be a function.'
    );
  });

  test('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';

    const schema = AnyFactory()
      .description(description)
      .example(example)
      .required();

    expect(schema.toObject()).toEqual({
      type: 'any',
      description,
      example,
      required: true,
      parse: false
    });
  });

  test('validateSync() should verify', () => {
    expect(AnyFactory().validateSync('test')).toBe('test');
  });

  test('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        AnyFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  test('validateAsync() should verify', async () => {
    await AnyFactory()
      .validate('test')
      .then(value => {
        expect(value).toBe('test');
      });
  });

  test('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      AnyFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });
});
