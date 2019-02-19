import { StringSchema, validateStringAsync, validateStringSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class StringSchemaMongoose extends StringSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate(): (value?: any) => Promise<any> {
    return async value => await validateStringAsync(value, this.options({ validation: true }));
  }

  validateSync(): (value?: any) => any {
    return value => validateStringSync(value, this.options({ validation: true }));
  }
}
