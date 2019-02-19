import { Message } from './../../src/utils/message';
import { shouldThrow } from '../helper';

describe('Message()', () => {
  test('addLocale() should verify', () => {
    const message = new Message();
    const actual = message.addLocale('test', {});
    expect(actual).toBe(message);
  });

  test('setLocale() should verify', () => {
    const message = new Message();
    const actual = message.setLocale('en-alt');
    expect(actual).toBe(message);
  });

  test('setLocale() should throw', () => {
    const message = new Message();

    shouldThrow(() => message.setLocale('unknown'), 'Validator configuration error: Unknown locale unknown.');
  });

  test('get() should default text', () => {
    expect(new Message().get('unknown_text')).toBe('Invalid.');
  });
});
