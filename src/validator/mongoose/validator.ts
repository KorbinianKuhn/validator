import { ValidatorOptions } from './../../interfaces';
import { VALIDATOR_OPTIONS, TYPES } from './options';
import { Validator, AnySchema } from '../default';
import {
  AnySchemaMongoose,
  ArraySchemaMongoose,
  BooleanSchemaMongoose,
  DateSchemaMongoose,
  NumberSchemaMongoose,
  ObjectSchemaMongoose,
  StringSchemaMongoose
} from '.';

export class MongooseValidator extends Validator {
  constructor(options: ValidatorOptions = {}) {
    super({ ...VALIDATOR_OPTIONS, ...options });
    this._types = TYPES;
  }

  Any(options: ValidatorOptions = {}): AnySchemaMongoose {
    return new AnySchemaMongoose(options, this._options);
  }

  Array(schema?: AnySchema, options: ValidatorOptions = {}): ArraySchemaMongoose {
    return new ArraySchemaMongoose(schema, options, this._options);
  }

  Boolean(options: ValidatorOptions = {}): BooleanSchemaMongoose {
    return new BooleanSchemaMongoose(options, this._options);
  }

  Date(options: ValidatorOptions = {}): DateSchemaMongoose {
    return new DateSchemaMongoose(options, this._options);
  }

  Number(options: ValidatorOptions = {}): NumberSchemaMongoose {
    return new NumberSchemaMongoose(options, this._options);
  }

  Object(schema: object = {}, options: ValidatorOptions = {}): ObjectSchemaMongoose {
    return new ObjectSchemaMongoose(schema, options, this._options);
  }

  String(options: ValidatorOptions = {}): StringSchemaMongoose {
    return new StringSchemaMongoose(options, this._options);
  }
}
