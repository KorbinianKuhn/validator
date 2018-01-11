const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const REQUEST = require('../../src/types/request');
const STRING = require('../../src/types/string');
const INTEGER = require('../../src/types/integer');
const BOOLEAN = require('../../src/types/boolean');
const OBJECT = require('../../src/types/object');

describe('REQUEST()', function () {
  it('invalid schema should throw', helper.mochaAsync(async() => {
    (() => {
      REQUEST().uri(null)
    }).should.throw('Invalid schema.');

    (() => {
      REQUEST().query(null)
    }).should.throw('Invalid schema.');

    (() => {
      REQUEST().body(null)
    }).should.throw('Invalid schema.');
  }));

  it('unknown schema should throw', helper.mochaAsync(async() => {
    (() => {
      REQUEST().uri(STRING())
    }).should.throw('Must be OBJECT or ARRAY Schema.');

    (() => {
      REQUEST().query(STRING())
    }).should.throw('Must be OBJECT or ARRAY Schema.');

    (() => {
      REQUEST().body(STRING())
    }).should.throw('Must be OBJECT or ARRAY Schema.');
  }));

  it('invalid req object should throw', helper.mochaAsync(async() => {
    const schema = OBJECT({
      name: STRING()
    });

    try {
      await REQUEST().uri(schema).validate(null);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.message.should.equal('Invalid express req object.');
    }
  }));

  it('object should get converted to schema and verify', helper.mochaAsync(async() => {
    const schema = {
      name: STRING()
    };

    const req = {
      params: {},
      query: {},
      body: {
        name: 'Jane Doe'
      }
    }

    const result = await REQUEST().body(schema).validate(req);
    result.should.deepEqual(req);
  }));

  it('invalid data should throw', helper.mochaAsync(async() => {
    const schema = OBJECT({
      name: STRING()
    });

    const req = {
      params: {},
      query: {},
      body: {}
    }

    try {
      await REQUEST().uri(schema).validate(req);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.deepEqual({
        uri: 'Object is empty.'
      });
    }

    try {
      await REQUEST().query(schema).validate(req);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.deepEqual({
        query: 'Object is empty.'
      });
    }

    try {
      await REQUEST().body(schema).validate(req);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.deepEqual({
        body: 'Object is empty.'
      });
    }
  }));

  it('valid data should verify', helper.mochaAsync(async() => {
    const req = {
      params: {
        id: '20'
      },
      query: {},
      body: {
        name: 'Jane Doe'
      }
    }

    const result = await REQUEST()
      .uri(OBJECT({
        id: INTEGER()
      }))
      .body(OBJECT({
        name: STRING()
      }))
      .query(OBJECT({
        deleted: BOOLEAN()
      }))
      .validate(req);

    result.should.deepEqual({
      params: {
        id: 20
      },
      query: {},
      body: {
        name: 'Jane Doe'
      }
    });

  }));

});
