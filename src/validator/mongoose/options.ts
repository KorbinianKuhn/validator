import { ValidatorOptions } from './../../interfaces/validator-options.interface';
import { AnySchemaMongoose } from './types/any';
import { ArraySchemaMongoose } from './types/array';
import { BooleanSchemaMongoose } from './types/boolean';
import { DateSchemaMongoose } from './types/date';
import { NumberSchemaMongoose } from './types/number';
import { ObjectSchemaMongoose } from './types/object';
import { StringSchemaMongoose } from './types/string';

export const VALIDATOR_OPTIONS: ValidatorOptions = {
  locale: 'en',
  requiredAsDefault: true,
  throwValidationErrors: true,
  parseToType: true,
  emptyStrings: false,
  trimStrings: true,
  emptyArrays: false,
  emptyObjects: false,
  unknownObjectKeys: false,
  parseDates: true,
  utc: true,
  nullAsUndefined: false
};

export const TYPES: any[] = [
  AnySchemaMongoose,
  ArraySchemaMongoose,
  BooleanSchemaMongoose,
  DateSchemaMongoose,
  NumberSchemaMongoose,
  ObjectSchemaMongoose,
  StringSchemaMongoose
];
