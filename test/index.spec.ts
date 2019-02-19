import { Validator, AngularValidator, ExpressValidator, MongooseValidator, ValidationError } from './../src';

describe('Library', () => {
  test('should return default validator', () => {
    expect(new Validator().constructor.name).toBe('Validator');
  });

  test('should return angular validator', () => {
    expect(new AngularValidator().constructor.name).toBe('AngularValidator');
  });

  test('should return express validator', () => {
    expect(new ExpressValidator().constructor.name).toBe('ExpressValidator');
  });

  test('should return mongoose validator', () => {
    expect(new MongooseValidator().constructor.name).toBe('MongooseValidator');
  });

  test('should return validation error', () => {
    expect(new ValidationError('test', null).constructor.name).toBe('ValidationError');
  });
});
