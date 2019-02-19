const {
  ExpressValidatorFactory
} = require('./../../../src/validator/express/validator');

describe('ExpressValidator()', () => {
  const validator = ExpressValidatorFactory();

  test('should create all types', () => {
    expect(validator.Any().constructor.name).toBe('ANY');
    expect(validator.Array().constructor.name).toBe('ARRAY');
    expect(validator.Boolean().constructor.name).toBe('BOOLEAN');
    expect(validator.Date().constructor.name).toBe('DATE');
    expect(validator.Number().constructor.name).toBe('NUMBER');
    expect(validator.Object().constructor.name).toBe('OBJECT');
    expect(validator.String().constructor.name).toBe('STRING');
    expect(validator.Request().constructor.name).toBe('REQUEST');
    expect(validator.Response().constructor.name).toBe('RESPONSE');
    expect(validator.Params({}).constructor.name).toBe('OBJECT');
    expect(validator.Query({}).constructor.name).toBe('OBJECT');
    expect(validator.Body({}).constructor.name).toBe('OBJECT');
  });

  test('middleware() should return middleware', () => {
    const middleware = validator.middleware();
    expect(typeof middleware).toBe('function');
  });
});
