import { ValidatorOptions } from '../../interfaces';
import { AnySchema, ArraySchema, BooleanSchema, DateSchema, NumberSchema, ObjectSchema, StringSchema } from '.';

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
  AnySchema,
  ArraySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema
];
