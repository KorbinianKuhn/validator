import { BooleanSchema, validateBooleanAsync, validateBooleanSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class BooleanSchemaMongoose extends BooleanSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate(): (value?: any) => Promise<any> {
    return async value => {
      await validateBooleanAsync(value, this.options({ validation: true }));
      return true;
    };
  }

  validateSync(): (value?: any) => any {
    return value => {
      validateBooleanSync(value, this.options({ validation: true }));
      return true;
    };
  }
}
