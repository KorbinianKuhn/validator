import { validateBooleanSync, validateBooleanAsync, BooleanSchema } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class BooleanSchemaAngular extends BooleanSchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate(): (formControl: any) => Promise<any> {
    return async formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validateBooleanAsync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }

  validateSync(): (formControl: any) => any {
    return formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        validateBooleanSync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}
