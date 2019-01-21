const {
  DateFactory
} = require('./../../../../src/validator/default/types/date');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/date', () => {
  const message = Message('en');

  test('DateFactory() should return DATE object', () => {
    expect(DateFactory().constructor.name).toBe('DATE');
  });

  test('options() should return options', () => {
    const func = () => {};
    const defaultValue = '2018-01-01T00:00:00.000Z';
    const allowed = [null];
    const not = ['not'];
    const only = ['only'];
    const parse = false;
    const description = 'description';
    const example = 'example';
    const utc = true;
    const min = '2018-01-01T00:00:00.000Z';
    const max = '2019-01-01T00:00:00.000Z';

    const schema = DateFactory()
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
      .utc(utc)
      .min(min)
      .max(max);

    expect(schema.options({ validation: true })).toEqual({
      defaultValue,
      allowed,
      func,
      not,
      only,
      parse,
      required: false,
      message,
      utc,
      min,
      max,
      nullAsUndefined: false
    });

    expect(schema.options()).toEqual({
      type: 'date',
      description,
      example,
      default: defaultValue,
      allowed,
      not,
      only,
      parse,
      required: false,
      utc,
      min,
      max
    });
  });

  test('func() with invalid argument should fail', () => {
    helper.shouldThrow(
      () => DateFactory().func('wrong'),
      'Validator configuration error: Must be a function.'
    );
  });

  test('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';

    const schema = DateFactory()
      .description(description)
      .example(example)
      .required();

    expect(schema.toObject()).toEqual({
      type: 'date',
      description,
      example,
      required: true,
      parse: false,
      utc: false
    });
  });

  test('validateSync() should verify', () => {
    expect(DateFactory().validateSync('2018-01-01T00:00:00.000Z')).toBe(
      '2018-01-01T00:00:00.000Z'
    );
  });

  test('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        DateFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  test('validateAsync() should verify', async () => {
    await DateFactory()
      .validate('2018-01-01T00:00:00.000Z')
      .then(value => {
        expect(value).toBe('2018-01-01T00:00:00.000Z');
      });
  });

  test('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      DateFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });
});
