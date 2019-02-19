import { NumberSchema, validateNumberAsync, validateNumberSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class NumberSchemaAngular extends NumberSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validateNumberAsync(value, this.options({ validation: true }));
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
        validateNumberSync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}
