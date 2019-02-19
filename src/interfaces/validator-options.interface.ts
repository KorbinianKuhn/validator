import { Message } from '../utils/message';

export interface ValidatorOptions {
  message?: Message;
  locale?: string;
  requiredAsDefault?: boolean;
  throwValidationErrors?: boolean;
  parseToType?: boolean;
  emptyStrings?: boolean;
  trimStrings?: boolean;
  emptyArrays?: boolean;
  emptyObjects?: boolean;
  unknownObjectKeys?: boolean;
  parseDates?: boolean;
  utc?: boolean;
  nullAsUndefined?: boolean;
}
