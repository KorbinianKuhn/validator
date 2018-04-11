import test from 'ava';
import { Validator } from './../index';

test('should create all default types', t => {
  const validator = Validator();
  t.is(validator.Any().constructor.name, 'ANY');
  t.is(validator.Array().constructor.name, 'ARRAY');
  t.is(validator.Boolean().constructor.name, 'BOOLEAN');
  t.is(validator.Date().constructor.name, 'DATE');
  t.is(validator.Number().constructor.name, 'NUMBER');
  t.is(validator.Object({}).constructor.name, 'OBJECT');
  t.is(validator.String().constructor.name, 'STRING');
});
