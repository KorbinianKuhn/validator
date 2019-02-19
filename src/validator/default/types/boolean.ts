import { ValidatorOptions } from '../../../interfaces';
import { AnySchema } from './any';
import { removeUndefinedProperties } from '../../../utils';
import { validateBooleanAsync, validateBooleanSync } from '../validation/boolean';

export class BooleanSchema extends AnySchema {
  constructor(options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);
  }

  options(options: any = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        func: this._func,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'boolean',
        description: this._description,
        example: this.example(),
        default: this._default
      });
    }
  }

  validate(value: any): Promise<any> | any {
    return validateBooleanAsync(value, this.options({ validation: true }));
  }

  validateSync(value: any): any {
    return validateBooleanSync(value, this.options({ validation: true }));
  }
}
