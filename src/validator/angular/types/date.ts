import { DateSchema, validateDateAsync, validateDateSync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class DateSchemaAngular extends DateSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validateDateAsync(value, this.options({ validation: true }));
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
        validateDateSync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}
