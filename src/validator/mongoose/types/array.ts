import { ArraySchema, AnySchema, validateArrayAsync, validateArraySync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class ArraySchemaMongoose extends ArraySchema {
  constructor(schema: AnySchema, options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(schema, options, defaults);
  }

  validate(): (value?: any) => Promise<any> {
    return async value => await validateArrayAsync(value, this.options({ validation: true }));
  }

  validateSync(): (value?: any) => any {
    return value => validateArraySync(value, this.options({ validation: true }));
  }
}
