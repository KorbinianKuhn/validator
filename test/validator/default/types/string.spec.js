const {
  StringFactory
} = require('./../../../../src/validator/default/types/string');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/string', () => {
  const message = Message('en');

  test('StringFactory() should return STRING object', () => {
    expect(StringFactory().constructor.name).toBe('STRING');
  });

  test('options() should return options', () => {
    const func = () => {};
    const defaultValue = 'test';
    const allowed = [null];
    const not = ['not'];
    const only = ['only'];
    const parse = false;
    const description = 'description';
    const example = 'example';
    const min = 1;
    const max = 3;
    const length = 2;
    const trim = true;
    const pattern = /A-Z/;
    const empty = false;
    const locales = { key: 'value' };

    const schema = StringFactory()
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .func(func)
      .min(min)
      .max(max)
      .length(length)
      .trim(trim)
      .regex(pattern, locales)
      .empty(empty);

    expect(schema.options({ validation: true })).toEqual({
      defaultValue,
      allowed,
      func,
      not,
      only,
      parse,
      required: false,
      message,
      min,
      max,
      length,
      trim,
      regex: {
        pattern,
        locales
      },
      empty,
      nullAsUndefined: false
    });

    expect(schema.options()).toEqual({
      type: 'string',
      description,
      example,
      default: defaultValue,
      allowed,
      not,
      only,
      parse,
      required: false,
      min,
      max,
      length,
      trim,
      pattern,
      empty
    });
  });

  test('regex() invalid regex should throw', () => {
    helper.shouldThrow(
      () => StringFactory().regex(true),
      'Validator configuration error: Must be a regular expression.'
    );
  });

  test('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';

    const schema = StringFactory()
      .description(description)
      .example(example)
      .required();

    expect(schema.toObject()).toEqual({
      type: 'string',
      description,
      example,
      required: true,
      empty: true,
      trim: false,
      parse: false
    });
  });

  test('validateSync() should verify', () => {
    expect(StringFactory().validateSync('test')).toBe('test');
  });

  test('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        StringFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  test('validateAsync() should verify', async () => {
    await StringFactory()
      .validate('test')
      .then(value => {
        expect(value).toBe('test');
      });
  });

  test('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      StringFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });
});
