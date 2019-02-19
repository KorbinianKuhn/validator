import { ArraySchema, AnySchema, validateArrayAsync, validateArraySync } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class ArraySchemaAngular extends ArraySchema {
  constructor(schema: AnySchema, options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(schema, options, defaults);
  }

  validate(): (formControl: any) => Promise<any> {
    return async formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validateArrayAsync(value, this.options({ validation: true }));
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
        validateArraySync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}
