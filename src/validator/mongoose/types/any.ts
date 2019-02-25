import { AnySchema, validateAnyAsync, validateAnySync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class AnySchemaMongoose extends AnySchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate(): (value?: any) => Promise<any> {
    return async value => {
      await validateAnyAsync(value, this.options({ validation: true }));
      return true;
    };
  }

  validateSync(): (value?: any) => any {
    return value => {
      validateAnySync(value, this.options({ validation: true }));
      return true;
    };
  }
}
