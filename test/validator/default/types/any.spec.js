import test from 'ava';
import { Validator } from './../../../../index';

const validator = Validator();

test('should return default options', t => {
  const actual = validator.Any().options();

  const expected = {
    type: 'any',
    default: undefined,
    description: undefined,
    example: undefined,
    not: undefined,
    only: undefined,
    required: true,
    parse: true
  };

  t.deepEqual(actual, expected);
});

test('should return set options', t => {
  const actual = validator
    .Any()
    .default('default')
    .description('description')
    .example('example')
    .not(['not'])
    .only(['only'])
    .optional()
    .parse(false)
    .options();

  const expected = {
    type: 'any',
    default: 'default',
    description: 'description',
    example: 'example',
    not: ['not'],
    only: ['only'],
    required: false,
    parse: false
  };

  t.deepEqual(actual, expected);
});

test('should return options for validation', t => {
  const func = () => {};

  const actual = validator
    .Any()
    .default('default')
    .not(['not'])
    .only(['only'])
    .func(func)
    .options({ validation: true });

  const expected = {
    defaultValue: 'default',
    not: ['not'],
    only: ['only'],
    required: true,
    parse: true,
    func: func,
    message: validator._message
  };

  t.deepEqual(actual, expected);
});
