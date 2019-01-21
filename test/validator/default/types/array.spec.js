const {
  ArrayFactory
} = require('./../../../../src/validator/default/types/array');
const {
  StringFactory
} = require('./../../../../src/validator/default/types/string');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/array', () => {
  const message = Message('en');

  test('ArrayFactory() should return ARRAY object', () => {
    expect(ArrayFactory().constructor.name).toBe('ARRAY');
  });

  test('options() should return options', () => {
    const func = () => {};
    const defaultValue = ['test'];
    const allowed = [null];
    const not = ['not'];
    const only = ['only'];
    const parse = false;
    const description = 'description';
    const example = 'example';
    const min = 1;
    const max = 3;
    const length = 2;
    const empty = false;
    const unique = true;

    const schema = ArrayFactory()
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
      .unique(unique)
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
      empty,
      unique,
      nullAsUndefined: false
    });

    expect(schema.options()).toEqual({
      type: 'array',
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
      empty,
      unique
    });
  });

  test('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';

    const schema = ArrayFactory()
      .description(description)
      .example(example)
      .required();

    expect(schema.toObject()).toEqual({
      type: 'array',
      description,
      example,
      required: true,
      empty: true,
      parse: false
    });
  });

  test('toObject() should return object with items', () => {
    const itemSchema = StringFactory();

    const schema = ArrayFactory(itemSchema);

    expect(schema.toObject()).toEqual({
      type: 'array',
      required: false,
      empty: true,
      parse: false,
      items: itemSchema.toObject(),
      example: ['No example provided']
    });
  });

  test('validateSync() should verify', () => {
    expect(ArrayFactory().validateSync(['test'])).toEqual(['test']);
  });

  test('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        ArrayFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  test('validateAsync() should verify', async () => {
    await ArrayFactory()
      .validate(['test'])
      .then(value => {
        expect(value).toEqual(['test']);
      });
  });

  test('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      ArrayFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });

  test('example() with no type should return empty array', () => {
    expect(ArrayFactory().example()).toEqual('No example provided');
  });
});
