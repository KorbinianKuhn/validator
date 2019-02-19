import { AnySchema, validateAnyAsync, validateAnySync } from '../../default';
import { ValidatorOptions } from '../../../interfaces';

export class AnySchemaAngular extends AnySchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  validate(): (formControl: any) => Promise<any> {
    return async (formControl: any) => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validateAnyAsync(value, this.options({ validation: true }));
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
        validateAnySync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}
