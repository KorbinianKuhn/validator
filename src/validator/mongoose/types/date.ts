import { DateSchema, validateDateAsync, validateDateSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class DateSchemaMongoose extends DateSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate(): (value?: any) => Promise<any> {
    return async value => await validateDateAsync(value, this.options({ validation: true }));
  }

  validateSync(): (value?: any) => any {
    return value => validateDateSync(value, this.options({ validation: true }));
  }
}
