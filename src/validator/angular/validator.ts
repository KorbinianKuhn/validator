import { ValidatorOptions } from './../../interfaces';
import { VALIDATOR_OPTIONS, TYPES } from './options';
import { Validator, AnySchema } from '../default';
import {
  AnySchemaAngular,
  ArraySchemaAngular,
  BooleanSchemaAngular,
  DateSchemaAngular,
  NumberSchemaAngular,
  ObjectSchemaAngular,
  StringSchemaAngular
} from '.';

export class AngularValidator extends Validator {
  constructor(options: ValidatorOptions = {}) {
    super({ ...VALIDATOR_OPTIONS, ...options });
    this._types = TYPES;
  }

  Any(options: ValidatorOptions = {}): AnySchemaAngular {
    return new AnySchemaAngular(options, this._options);
  }

  Array(schema?: AnySchema, options: ValidatorOptions = {}): ArraySchemaAngular {
    return new ArraySchemaAngular(schema, options, this._options);
  }

  Boolean(options: ValidatorOptions = {}): BooleanSchemaAngular {
    return new BooleanSchemaAngular(options, this._options);
  }

  Date(options: ValidatorOptions = {}): DateSchemaAngular {
    return new DateSchemaAngular(options, this._options);
  }

  Number(options: ValidatorOptions = {}): NumberSchemaAngular {
    return new NumberSchemaAngular(options, this._options);
  }

  Object(schema: object = {}, options: ValidatorOptions = {}): ObjectSchemaAngular {
    return new ObjectSchemaAngular(schema, options, this._options);
  }

  String(options: ValidatorOptions = {}): StringSchemaAngular {
    return new StringSchemaAngular(options, this._options);
  }
}
