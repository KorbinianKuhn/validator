import test from 'ava';
import { Validator } from './../../../../index';

const validator = Validator();

/*
const schemas = [
  () => .default('test'),
  () => validator.Boolean().default(true),
  () => validator.Date().default(),
  () => validator.Number().default(2),
  () => validator.Object({}).default({}),
  () => validator.String().default('test')
];*/

const schemas = {
  any: {
    object: validator.Any(),
    default: 'test',
    value: 'hello'
  },
  boolean: {
    object: validator.Boolean(),
    default: true,
    value: false
  },
  date: {
    object: validator.Date(),
    default: '2018-01-01T00:00:00.000Z',
    value: '2019-01-01T00:00:00.000Z'
  }
};

test('validate() undefined should return default value', async t => {
  for (const key in schemas) {
    const schema = schemas[key].object.default(schemas[key].default);
    t.is(await schema.validate(), schemas[key].default);
  }
});

test('validateSync() undefined should return default value', t => {
  for (const key in schemas) {
    const schema = schemas[key].object.default(schemas[key].default);
    t.is(schema.validateSync(), schemas[key].default);
  }
});

test('validate() return given value', async t => {
  for (const key in schemas) {
    const schema = schemas[key].object.default(schemas[key].default);
    t.is(await schema.validate(schemas[key].value), schemas[key].value);
  }
});

test('validateSync() return given value', t => {
  for (const key in schemas) {
    const schema = schemas[key].object.default(schemas[key].default);
    t.is(schema.validateSync(schemas[key].value), schemas[key].value);
  }
});
