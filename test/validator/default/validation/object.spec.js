const {
  validateObjectBeforeProperties,
  validateObjectPropertiesSync,
  validateObjectPropertiesAsync,
  validateObjectAfterProperties,
  validateCondition,
  validateObjectConditions,
  validateObjectFunctionSync,
  validateObjectFunctionAsync,
  validateSync,
  validate
} = require('./../../../../src/validator/default/validation/object');
const { Message } = require('./../../../../src/utils/message');
const helper = require('./../../../helper');
const {
  StringFactory
} = require('./../../../../src/validator/default/types/string');

describe('validator/default/validation/object', () => {
  const message = Message('en');

  test('validateObjectBeforeProperties() should return given value', () => {
    const actual = validateObjectBeforeProperties(
      {},
      { message, required: true }
    );
    expect(actual).toEqual({});
  });

  test('validateObjectBeforeProperties() should return defaultValue', () => {
    const actual = validateObjectBeforeProperties(undefined, {
      message,
      required: true,
      defaultValue: {}
    });
    expect(actual).toEqual({});
  });

  test('validateObjectBeforeProperties() with undefined should verify', () => {
    const actual = validateObjectBeforeProperties(undefined, {});
    expect(actual).toBe(undefined);
  });

  test('validateObjectBeforeProperties() with null should verify', () => {
    const actual = validateObjectBeforeProperties(null, {
      allowed: [null]
    });
    expect(actual).toBe(null);
  });

  test('validateObjectBeforeProperties() with undefined should throw', () => {
    helper.shouldThrow(
      () =>
        validateObjectBeforeProperties(undefined, {
          message,
          required: true,
          allowed: []
        }),
      'Required but is undefined.'
    );
  });

  test('validateObjectBeforeProperties() should throw', () => {
    helper.shouldThrow(
      () =>
        validateObjectBeforeProperties('wrong', { message, required: true }),
      'Must be type object but is string.'
    );
  });

  test('validateObjectBeforeProperties() should parse to object', () => {
    let actual = validateObjectBeforeProperties('{}', {
      parse: true
    });
    expect(actual).toEqual({});
  });

  test('validateObjectBeforeProperties() should try parse to object but fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectBeforeProperties('wrong', {
          message,
          parse: true
        }),
      'Must be type object but is string.'
    );
  });

  test('validateObjectBeforeProperties() empty object should verify', () => {
    let actual = validateObjectBeforeProperties(
      {},
      {
        empty: true
      }
    );
    expect(actual).toEqual({});
  });

  test('validateObjectBeforeProperties() empty object should fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          {},
          {
            message,
            empty: false
          }
        ),
      'Object is empty.'
    );
  });

  test('validateObjectBeforeProperties() length should verify', () => {
    let actual = validateObjectBeforeProperties(
      { key: 'value' },
      {
        length: 1
      }
    );
    expect(actual).toEqual({ key: 'value' });
  });

  test('validateObjectBeforeProperties() min length should fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          {},
          {
            message,
            min: 1
          }
        ),
      'Must have at least 1 keys.'
    );
  });

  test('validateObjectBeforeProperties() min length should verify', () => {
    let actual = validateObjectBeforeProperties(
      { key: 'value' },
      {
        min: 1
      }
    );
    expect(actual).toEqual({ key: 'value' });
  });

  test('validateObjectBeforeProperties() max length should fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          { key: 'value', invalid: 'value' },
          {
            message,
            max: 1
          }
        ),
      'Must have at most 1 keys.'
    );
  });

  test('validateObjectBeforeProperties() max length should verify', () => {
    let actual = validateObjectBeforeProperties(
      { key: 'value' },
      {
        max: 1
      }
    );
    expect(actual).toEqual({ key: 'value' });
  });

  test('validateObjectBeforeProperties() length should fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectBeforeProperties(
          {},
          {
            message,
            length: 1
          }
        ),
      'Must have exactly 1 keys.'
    );
  });

  test('validateObjectPropertiesSync() should verify', () => {
    const schema = StringFactory({}, { message });
    const actual = validateObjectPropertiesSync(
      { key: 'test' },
      { key: schema }
    );
    expect(actual).toEqual({ key: 'test' });
  });

  test('validateObjectPropertiesSync() should fail', () => {
    const schema = StringFactory({}, { message });
    helper.shouldThrow(
      () => validateObjectPropertiesSync({ key: 2 }, { key: schema }),
      {
        key: 'Must be type string but is number.'
      }
    );
  });

  test('validateObjectPropertiesAsync() should verify', async () => {
    const schema = StringFactory({}, { message });
    const actual = await validateObjectPropertiesAsync(
      { key: 'test' },
      { key: schema }
    );
    expect(actual).toEqual({ key: 'test' });
  });

  test('validateObjectPropertiesAsync() should fail', async () => {
    const schema = StringFactory({}, { message });
    await helper.shouldEventuallyThrow(
      validateObjectPropertiesAsync({ key: 2 }, { key: schema }),
      {
        key: 'Must be type string but is number.'
      }
    );
  });

  test('validateObjectAfterProperties() should verify', () => {
    validateObjectAfterProperties({}, {});
  });

  test('validateObjectAfterProperties() with unknown key should fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectAfterProperties(
          { key: 'value' },
          { message, unknown: false, object: {} }
        ),
      { key: 'Unknown key.' }
    );
  });

  test('validateObjectAfterProperties() with keys should verify', () => {
    const schema = StringFactory({}, { message });
    validateObjectAfterProperties(
      { key: 'value' },
      { unknown: false, object: { key: schema } }
    );
  });

  test('validateObjectAfterProperties() with conditions should verify', () => {
    validateObjectAfterProperties({}, { conditions: [] });
  });

  test('validateCondition() gt should verify', () => {
    validateCondition(message, 'gt', 'a', 'b', 2, 1);
    validateCondition(message, 'gt', 'a', 'b', {}, {});
  });

  test('validateCondition() gt should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'gt', 'a', 'b', 1, 2),
      'Must be greater than b.'
    );
  });

  test('validateCondition() gte should verify', () => {
    validateCondition(message, 'gte', 'a', 'b', 2, 1);
    validateCondition(message, 'gte', 'a', 'b', {}, {});
  });

  test('validateCondition() gte should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'gte', 'a', 'b', 1, 2),
      'Must be greater than or equal b.'
    );
  });

  test('validateCondition() lt should verify', () => {
    validateCondition(message, 'lt', 'a', 'b', 1, 2);
    validateCondition(message, 'lt', 'a', 'b', {}, {});
  });

  test('validateCondition() lt should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'lt', 'a', 'b', 2, 1),
      'Must be less than b.'
    );
  });

  test('validateCondition() lte should verify', () => {
    validateCondition(message, 'lte', 'a', 'b', 1, 2);
    validateCondition(message, 'lte', 'a', 'b', {}, {});
  });

  test('validateCondition() lte should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'lte', 'a', 'b', 2, 1),
      'Must be less than or equal b.'
    );
  });

  test('validateCondition() equals should verify', () => {
    validateCondition(message, 'equals', 'a', 'b', 2, 2);
  });

  test('validateCondition() equals should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'equals', 'a', 'b', 2, 1),
      'Must equal b.'
    );
  });

  test('validateCondition() notEquals should verify', () => {
    validateCondition(message, 'notEquals', 'a', 'b', 1, 2);
  });

  test('validateCondition() notEquals should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'notEquals', 'a', 'b', 2, 2),
      'Must not equal b.'
    );
  });

  test('validateCondition() xor should verify', () => {
    validateCondition(message, 'xor', 'a', 'b', 1, undefined);
  });

  test('validateCondition() xor should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'xor', 'a', 'b', 1, 2),
      'Either a or b must be set.'
    );

    helper.shouldThrow(
      () => validateCondition(message, 'xor', 'a', 'b', undefined, undefined),
      'Either a or b must be set.'
    );
  });

  test('validateCondition() or should verify', () => {
    validateCondition(message, 'or', 'a', 'b', 1, undefined);
    validateCondition(message, 'or', 'a', 'b', undefined, 1);
  });

  test('validateCondition() or should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'or', 'a', 'b', 1, 2),
      'Either a or b can be set.'
    );
  });

  test('validateCondition() dependsOn should verify', () => {
    validateCondition(message, 'dependsOn', 'a', 'b', 1, 2);
  });

  test('validateCondition() dependsOn should fail', () => {
    helper.shouldThrow(
      () => validateCondition(message, 'dependsOn', 'a', 'b', 1, undefined),
      'Depends on b.'
    );
  });

  test('validateObjectConditions() with no conditions should verify', () => {
    validateObjectConditions(message, {}, []);
  });

  test('validateObjectConditions() with conditions should verify', () => {
    validateObjectConditions(message, { a: 1, b: 2 }, [
      {
        keyA: 'a',
        keyB: 'b',
        method: 'lt'
      }
    ]);
  });

  test('validateObjectConditions() with conditions should fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectConditions(message, { a: 3, b: 2 }, [
          {
            keyA: 'a',
            keyB: 'b',
            method: 'lt'
          }
        ]),
      {
        a: 'Must be less than b.'
      }
    );
  });

  test('validateObjectConditions() with multiple failing conditions should fail', () => {
    helper.shouldThrow(
      () =>
        validateObjectConditions(message, { a: 3, b: 2 }, [
          {
            keyA: 'a',
            keyB: 'b',
            method: 'lt'
          },
          {
            keyA: 'a',
            keyB: 'b',
            method: 'xor'
          }
        ]),
      {
        a: 'Must be less than b. Either a or b must be set.'
      }
    );
  });

  test('validateObjectFunctionSync() without function should verify', () => {
    validateObjectFunctionSync({}, undefined);
  });

  test('validateObjectFunctionSync() should verify', () => {
    const func = {
      fn: value => value,
      keys: ['a']
    };
    validateObjectFunctionSync({}, func);
  });

  test('validateObjectFunctionSync() should fail', () => {
    const func = {
      fn: () => {
        throw new Error('test');
      },
      keys: ['a', 'b']
    };
    helper.shouldThrow(() => validateObjectFunctionSync({}, func), {
      '[a, b]': 'test'
    });
  });

  test('validateObjectFunctionAsync() without function should verify', async () => {
    await validateObjectFunctionAsync({}, undefined);
  });

  test('validateObjectFunctionAsync() should verify', async () => {
    const func = {
      fn: value => value,
      keys: ['a']
    };
    await validateObjectFunctionAsync({}, func);
  });

  test('validateObjectFunctionAsync() should fail', async () => {
    const func = {
      fn: () => {
        throw new Error('test');
      },
      keys: ['a', 'b']
    };
    await helper.shouldEventuallyThrow(validateObjectFunctionAsync({}, func), {
      '[a, b]': 'test'
    });
  });

  test('validateObjectFunctionAsync() with Async function should fail', async () => {
    const func = {
      fn: async () => {
        throw new Error('test');
      },
      keys: ['a', 'b']
    };
    await helper.shouldEventuallyThrow(validateObjectFunctionAsync({}, func), {
      '[a, b]': 'test'
    });
  });

  test('validateSync() should return given value', () => {
    const actual = validateSync({}, {});
    expect(actual).toEqual({});
  });

  test('validate() should return given value', async () => {
    const actual = await validate({}, {});
    expect(actual).toEqual({});
  });
});
