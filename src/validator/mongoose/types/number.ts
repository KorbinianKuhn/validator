import { NumberSchema, validateNumberAsync, validateNumberSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class NumberSchemaMongoose extends NumberSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate(): (value?: any) => Promise<any> {
    return async value => {
      await validateNumberAsync(value, this.options({ validation: true }));
      return true;
    };
  }

  validateSync(): (value?: any) => any {
    return value => {
      validateNumberSync(value, this.options({ validation: true }));
      return true;
    };
  }
}
