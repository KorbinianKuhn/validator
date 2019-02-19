import { ValidatorOptions } from './../../interfaces';
import {
  AnySchema,
  ArraySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema
} from '../default';
import { RequestSchemaExpress, ResponseSchemaExpress } from '.';

export const MIDDLEWARE_OPTIONS = {
  details: true,
  next: false
};

export const TYPES: any[] = [
  AnySchema,
  ArraySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
  RequestSchemaExpress,
  ResponseSchemaExpress
];

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

export const URI_OPTIONS = {};

export const QUERY_OPTIONS = {
  requiredAsDefault: false,
  emptyObjects: true
};

export const BODY_OPTIONS = {};
