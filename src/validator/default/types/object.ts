import { ValidatorOptions } from '../../../interfaces';
import { AnySchema } from './any';
import { toObject, isPlainObject, defaultToAny, removeUndefinedProperties, isFunction } from '../../../utils';
import { validateObjectAsync, validateObjectSync } from '../validation/object';

const objectToSchema = (object: any, options: ValidatorOptions, defaults: ValidatorOptions): ObjectSchema => {
  Object.keys(object)
    .filter(k => object[k].constructor.name === 'Object')
    .map(k => {
      object[k] = new ObjectSchema(object[k], options, defaults);
    });
  return object;
};

interface Condition {
  keyA: string;
  keyB: string;
  method: 'gt' | 'gte' | 'lt' | 'lte' | 'xor' | 'or' | 'equals' | 'notEquals' | 'dependsOn';
}

export class ObjectSchema extends AnySchema {
  public _object: ObjectSchema;
  public _empty: boolean;
  public _conditions: Condition[];
  public _unknown: boolean;
  public _min: number;
  public _max: number;
  public _length: number;
  public _object_func: {
    fn: Function;
    keys: string[];
  };

  constructor(schema: object = {}, options: ValidatorOptions = {}, defaults: ValidatorOptions = {}) {
    super(options, defaults);

    if (!isPlainObject(schema)) {
      throw this._message.error('object_invalid_type');
    }

    this._conditions = [];
    this._object = objectToSchema(schema, options, defaults);
    this._empty = defaultToAny(options.emptyObjects, defaults.emptyObjects, true);
    this._unknown = defaultToAny(options.unknownObjectKeys, defaults.unknownObjectKeys, true);
  }

  options(options: any = {}) {
    const settings = {
      allowed: this._allowed,
      required: this._required,
      parse: this._parse,
      only: this._only,
      not: this._not,
      min: this._min,
      max: this._max,
      length: this._length,
      empty: this._empty,
      unknown: this._unknown
    };
    if (options.validation) {
      return removeUndefinedProperties({
        ...settings,
        defaultValue: this._default,
        message: this._message,
        object: this._object,
        func: this._object_func,
        conditions: this._conditions,
        nullAsUndefined: this._nullAsUndefined
      });
    } else {
      return removeUndefinedProperties({
        ...settings,
        type: 'object',
        description: this._description,
        example: this.example(),
        default: this._default
      });
    }
  }

  validate(value: any): Promise<any> | any {
    return validateObjectAsync(value, this.options({ validation: true }));
  }

  validateSync(value: any): any {
    return validateObjectSync(value, this.options({ validation: true }));
  }

  example(example?: any): any | this {
    if (example === undefined) {
      if (this._example === undefined) {
        const example = {};
        for (const key in this._object) {
          example[key] = this._object[key].example();
        }
        return example;
      } else {
        return this._example;
      }
    } else {
      this._example = example;
      return this;
    }
  }

  empty(value: boolean): this {
    this._empty = value;
    return this;
  }

  gt(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'gt' });
    return this;
  }

  gte(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'gte' });
    return this;
  }

  lt(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'lt' });
    return this;
  }

  lte(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'lte' });
    return this;
  }

  equals(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'equals' });
    return this;
  }

  notEquals(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'notEquals' });
    return this;
  }

  dependsOn(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'dependsOn' });
    return this;
  }

  xor(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'xor' });
    return this;
  }

  or(a: string, b: string): this {
    this._conditions.push({ keyA: a, keyB: b, method: 'or' });
    return this;
  }

  func(fn: Function, ...keys: string[]): this {
    if (!isFunction(fn)) {
      throw this._message.error('invalid_function');
    }

    this._object_func = {
      fn,
      keys
    };
    return this;
  }

  min(length: number): this {
    this._min = length;
    return this;
  }

  max(length: number): this {
    this._max = length;
    return this;
  }

  length(length: number): this {
    this._length = length;
    return this;
  }

  unknown(value: boolean): this {
    this._unknown = value;
    return this;
  }

  toObject(options: any = {}): any {
    const properties = {};
    for (const key in this._object) {
      properties[key] = this._object[key].toObject(options);
    }
    return toObject({ ...this.options(), properties }, options);
  }

  // TODO rename
  // rename(source, target) {
  //   return this;
  // }
}
