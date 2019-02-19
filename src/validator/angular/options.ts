import {
  AnySchemaAngular,
  ArraySchemaAngular,
  BooleanSchemaAngular,
  DateSchemaAngular,
  NumberSchemaAngular,
  ObjectSchemaAngular,
  StringSchemaAngular
} from '.';
import { ValidatorOptions } from './../../interfaces';

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
  nullAsUndefined: true
};

export const TYPES: any[] = [
  AnySchemaAngular,
  ArraySchemaAngular,
  BooleanSchemaAngular,
  DateSchemaAngular,
  NumberSchemaAngular,
  ObjectSchemaAngular,
  StringSchemaAngular
];
