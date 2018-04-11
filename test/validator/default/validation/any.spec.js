import test from 'ava';

const { Message } = require('./../../../../src/utils/message');
const {
  validateAny,
  validateRequired,
  validateFunctionAsync,
  validateFunctionSync,
  validateOnly,
  validateNot
} = require('./../../../../src/validator/default/validation/any');

const message = Message('en');

test('validateRequired() required but undefined should fail', t => {
  t.throws(
    () => validateRequired(undefined, true, message),
    error => error.code === 'required'
  );
});

test('validateRequired() optional but undefined should verify', t => {
  t.notThrows(() => validateRequired(undefined, false, message));
});

test('validateFunctionAsync() with async function should throw', async t => {
  await t.throws(
    validateFunctionAsync(async () => {
      throw new Error('message');
    }, 'test'),
    'message'
  );
});

test('validateFunctionAsync() with async function should verify', async t => {
  t.is(await validateFunctionAsync(async () => {}, 'test'), 'test');
});

test('validateFunctionAsync() with async function should return new value', async t => {
  t.is(await validateFunctionAsync(async () => 'hello', 'test'), 'hello');
});

test('validateFunctionAsync() with sync function should throw', async t => {
  await t.throws(
    validateFunctionAsync(() => {
      throw new Error('message');
    }, 'test'),
    'message'
  );
});

test('validateFunctionAsync() with sync function should verify', async t => {
  t.is(await validateFunctionAsync(() => {}, 'test'), 'test');
});

test('validateFunctionAsync() with sync function should return new value', async t => {
  t.is(await validateFunctionAsync(() => 'hello', 'test'), 'hello');
});

test('validateFunctionSync() should throw', t => {
  t.throws(
    () =>
      validateFunctionSync(() => {
        throw new Error('message');
      }, 'test'),
    'message'
  );
});

test('validateFunctionSync() should verify', t => {
  t.is(validateFunctionSync(() => {}, 'test'), 'test');
});

test('validateFunctionSync() should return new value', t => {
  t.is(validateFunctionSync(() => 'hello', 'test'), 'hello');
});

test('validateAny() should return default value', t => {
  t.is(validateAny({ defaultValue: 'hello' }), 'hello');
});

test('validateOnly() should throw', t => {
  t.throws(
    () => validateOnly(['test'], 'hello', message),
    error => error.code === 'only'
  );
});

test('validateOnly() should verify', t => {
  t.notThrows(() => validateOnly(['test'], 'test', message));
});

test('validateOnly() with unset array should verify', t => {
  t.notThrows(() => validateOnly(undefined, 'hello', message));
});

test('validateNot() should throw', t => {
  t.throws(
    () => validateNot(['test'], 'test', message),
    error => error.code === 'not'
  );
});

test('validateNot() should verify', t => {
  t.notThrows(() => validateNot(['test'], 'hello', message));
});

test('validateNot() with unset array should verify', t => {
  t.notThrows(() => validateNot(undefined, 'hello', message));
});
