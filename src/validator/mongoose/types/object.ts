import { ObjectSchema, validateObjectAsync, validateObjectSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class ObjectSchemaMongoose extends ObjectSchema {
  constructor(schema: object, options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(schema, options, defaults);
  }

  validate(): (value?: any) => Promise<any> {
    return async value => {
      await validateObjectAsync(value, this.options({ validation: true }));
      return true;
    };
  }

  validateSync(): (value?: any) => any {
    return value => {
      validateObjectSync(value, this.options({ validation: true }));
      return true;
    };
  }
}
