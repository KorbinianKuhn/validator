const { Message } = require('./../../src/utils/message');
const helper = require('./../helper');

describe('Message()', () => {
  test('addLocale() should verify', () => {
    const message = Message();
    const actual = message.addLocale('test', {});
    expect(actual).toBe(message);
  });

  test('setLocale() should verify', () => {
    const message = Message();
    const actual = message.setLocale('en-alt');
    expect(actual).toBe(message);
  });

  test('setLocale() should throw', () => {
    const message = Message();

    helper.shouldThrow(
      () => message.setLocale('unknown'),
      'Validator configuration error: Unknown locale unknown.'
    );
  });

  test('get() should default text', () => {
    expect(Message().get('unknown_text')).toBe('Invalid.');
  });
});
