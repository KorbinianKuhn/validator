const lib = require('./../index');

describe('Library', () => {
  test('should return default validator', () => {
    expect(lib.Validator().constructor.name).toBe('Validator');
  });

  test('should return angular validator', () => {
    expect(lib.AngularValidator().constructor.name).toBe('AngularValidator');
  });

  test('should return express validator', () => {
    expect(lib.ExpressValidator().constructor.name).toBe('ExpressValidator');
  });

  test('should return mongoose validator', () => {
    expect(lib.MongooseValidator().constructor.name).toBe('MongooseValidator');
  });

  test('should return validation error', () => {
    expect(new lib.ValidationError().constructor.name).toBe('ValidationError');
  });
});
