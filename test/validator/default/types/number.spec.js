const {
  NumberFactory
} = require('./../../../../src/validator/default/types/number');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/number', () => {
  const message = Message('en');

  test('NumberFactory() should return NUMBER object', () => {
    expect(NumberFactory().constructor.name).toBe('NUMBER');
  });

  test('options() should return options', () => {
    const func = () => {};
    const defaultValue = 2;
    const allowed = [null];
    const not = [0];
    const only = [2];
    const parse = false;
    const description = 'description';
    const example = 'example';
    const min = 1;
    const max = 3;
    const less = 4;
    const greater = 0;
    const positive = true;
    const negative = true;

    const schema = NumberFactory()
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .integer()
      .func(func)
      .min(min)
      .max(max)
      .less(less)
      .greater(greater)
      .positive(positive)
      .negative(negative);

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
      less,
      greater,
      negative,
      positive,
      integer: true,
      nullAsUndefined: false
    });

    expect(schema.options()).toEqual({
      type: 'number',
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
      less,
      greater,
      negative,
      positive,
      integer: true
    });
  });

  test('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';

    const schema = NumberFactory()
      .description(description)
      .example(example)
      .required();

    expect(schema.toObject()).toEqual({
      type: 'number',
      description,
      example,
      required: true,
      parse: false,
      integer: false
    });
  });

  test('validateSync() should verify', () => {
    expect(NumberFactory().validateSync(2)).toBe(2);
  });

  test('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        NumberFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  test('validateAsync() should verify', async () => {
    await NumberFactory()
      .validate(2)
      .then(value => {
        expect(value).toBe(2);
      });
  });

  test('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      NumberFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });
});
