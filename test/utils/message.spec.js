const { Message } = require('./../../src/utils/message');
const helper = require('./../helper');

describe('Message()', () => {
  it('addLocale() should verify', () => {
    const message = Message();
    const actual = message.addLocale('test', {});
    actual.should.equal(message);
  });

  it('setLocale() should verify', () => {
    const message = Message();
    const actual = message.setLocale('en-alt');
    actual.should.equal(message);
  });

  it('setLocale() should throw', () => {
    const message = Message();

    helper.shouldThrow(
      () => message.setLocale('unknown'),
      'Validator configuration error: Unknown locale unknown.'
    );
  });

  it('get() should default text', () => {
    Message()
      .get('unknown_text')
      .should.equal('Invalid.');
  });
});
