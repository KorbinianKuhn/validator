import { StringSchema, validateStringAsync, validateStringSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class StringSchemaAngular extends StringSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validateStringAsync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }

  validateSync() {
    return formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        validateStringSync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}
