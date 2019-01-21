const {
  ObjectFactory
} = require('./../../../../src/validator/default/types/object');
const {
  StringFactory
} = require('./../../../../src/validator/default/types/string');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');

describe('validator/default/types/object', () => {
  const message = Message('en');

  test('ObjectFactory() should return OBJECT object', () => {
    expect(ObjectFactory().constructor.name).toBe('OBJECT');
  });

  test('ObjectFactory() should with invalid object should throw', () => {
    helper.shouldThrow(
      () => ObjectFactory('wrong'),
      'Validator configuration error: Must be an object.'
    );
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
    const object = {};
    const unknown = true;

    const schema = ObjectFactory(object)
      .description(description)
      .example(example)
      .default(defaultValue)
      .allow(...allowed)
      .not(...not)
      .only(...only)
      .parse(parse)
      .required()
      .optional()
      .func(func, 'test')
      .min(min)
      .max(max)
      .length(length)
      .empty(empty)
      .unknown(unknown);

    expect(schema.options({ validation: true })).toEqual({
      defaultValue,
      allowed,
      func: {
        fn: func,
        keys: ['test']
      },
      not,
      only,
      parse,
      required: false,
      message,
      min,
      max,
      length,
      empty,
      object,
      unknown,
      conditions: [],
      nullAsUndefined: false
    });

    expect(schema.options()).toEqual({
      type: 'object',
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
      unknown
    });
  });

  test('toObject() should return object', () => {
    const description = 'description';
    const example = 'example';
    const name = StringFactory();

    const schema = ObjectFactory({ name })
      .description(description)
      .example(example)
      .required();

    expect(schema.toObject()).toEqual({
      type: 'object',
      description,
      example,
      required: true,
      empty: true,
      parse: false,
      unknown: true,
      properties: {
        name: name.toObject()
      }
    });
  });

  test('validateSync() should verify', () => {
    expect(ObjectFactory().validateSync({})).toEqual({});
  });

  test('validateSync() should fail', () => {
    helper.shouldThrow(
      () =>
        ObjectFactory()
          .required()
          .validateSync(undefined),
      'Required but is undefined.'
    );
  });

  test('validateAsync() should verify', async () => {
    await ObjectFactory()
      .validate({})
      .then(value => {
        expect(value).toEqual({});
      });
  });

  test('validateAsync() should fail', async () => {
    await helper.shouldEventuallyThrow(
      ObjectFactory()
        .required()
        .validate(undefined),
      'Required but is undefined.'
    );
  });

  test('func() with invalid type should throw', () => {
    helper.shouldThrow(
      () => ObjectFactory({}).func('wrong'),
      'Validator configuration error: Must be a function.'
    );
  });

  test('conditions should get added', () => {
    const schema = ObjectFactory({})
      .gt('a', 'b')
      .gte('a', 'b')
      .lt('a', 'b')
      .lte('a', 'b')
      .equals('a', 'b')
      .notEquals('a', 'b')
      .dependsOn('a', 'b')
      .xor('a', 'b')
      .or('a', 'b');
    expect(schema._conditions).toEqual([
      { keyA: 'a', keyB: 'b', method: 'gt' },
      { keyA: 'a', keyB: 'b', method: 'gte' },
      { keyA: 'a', keyB: 'b', method: 'lt' },
      { keyA: 'a', keyB: 'b', method: 'lte' },
      { keyA: 'a', keyB: 'b', method: 'equals' },
      { keyA: 'a', keyB: 'b', method: 'notEquals' },
      { keyA: 'a', keyB: 'b', method: 'dependsOn' },
      { keyA: 'a', keyB: 'b', method: 'xor' },
      { keyA: 'a', keyB: 'b', method: 'or' }
    ]);
  });

  test('example() should return generated example', () => {
    const schema = ObjectFactory({ name: StringFactory().example('Jane Doe') });
    expect(schema.example()).toEqual({ name: 'Jane Doe' });
  });

  test('example() should return generated example', () => {
    const schema = ObjectFactory({ name: StringFactory() });
    expect(schema.example()).toEqual({ name: 'No example provided' });
  });

  test('example() should return set example', () => {
    const schema = ObjectFactory({
      name: StringFactory().example('Jane Doe')
    }).example({ name: 'John Doe' });
    expect(schema.example()).toEqual({ name: 'John Doe' });
  });

  test('clone() should keep function', () => {
    const func = () => {};
    const schema = ObjectFactory({
      name: StringFactory()
    }).func(func, 'name');

    const cloned = schema.clone();

    expect(cloned._func.fn).toEqual(func);
  });

  test('validation of optional object with null allowed and value of null should return null', () => {
    const schema = ObjectFactory({
      subschema: ObjectFactory({
        name: StringFactory()
      })
        .optional()
        .allow(null)
    });

    const result = schema.validateSync({ subschema: null });
    expect(result).toEqual({ subschema: null });
  });
});
