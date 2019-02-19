import { validateObjectAsync, validateObjectSync, ObjectSchema } from './../../default';
import { ValidatorOptions } from './../../../interfaces';

export class ObjectSchemaAngular extends ObjectSchema {
  constructor(schema: object, options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(schema, options, defaults);
  }

  validate() {
    return async formControl => {
      try {
        const value = formControl.value === '' ? undefined : formControl.value;
        await validateObjectAsync(value, this.options({ validation: true }));
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
        validateObjectSync(value, this.options({ validation: true }));
        return null;
      } catch (err) {
        return { validation: err };
      }
    };
  }
}
