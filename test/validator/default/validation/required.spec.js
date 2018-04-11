import test from 'ava';
import { Validator } from './../../../../index';

const validator = Validator();

const schemas = [
  () => validator.Any(),
  () => validator.Boolean(),
  () => validator.Date(),
  () => validator.Number(),
  () => validator.Object({}),
  () => validator.String()
];

test('validate() required but undefined should fail', async t => {
  for (const schema of schemas) {
    await t.throws(schema().validate(), error => error.code === 'required');
  }
});

test('validateSync() required but undefined should fail', t => {
  for (const schema of schemas) {
    t.throws(() => schema().validateSync(), error => error.code === 'required');
  }
});

test('validate() optional but undefined should fail', async t => {
  for (const schema of schemas) {
    t.is(
      await schema()
        .optional()
        .validate(),
      undefined
    );
  }
});

test('validateSync() optional but undefined should fail', t => {
  for (const schema of schemas) {
    t.is(
      schema()
        .optional()
        .validateSync(),
      undefined
    );
  }
});
