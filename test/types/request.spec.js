const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const REQUEST = require('../../src/types/request');
const STRING = require('../../src/types/string');
const INTEGER = require('../../src/types/integer');
const BOOLEAN = require('../../src/types/boolean');
const OBJECT = require('../../src/types/object');
const ARRAY = require('../../src/types/array');

describe('REQUEST()', () => {
  it('invalid schema should throw', helper.mochaAsync(async () => {
    (() => {
      REQUEST().params(null);
    }).should.throw('Invalid schema.');

    (() => {
      REQUEST().query(null);
    }).should.throw('Invalid schema.');

    (() => {
      REQUEST().body(null);
    }).should.throw('Invalid schema.');
  }));

  it('unknown schema should throw', helper.mochaAsync(async () => {
    (() => {
      REQUEST().params(STRING());
    }).should.throw('Must be OBJECT or ARRAY Schema.');

    (() => {
      REQUEST().query(STRING());
    }).should.throw('Must be OBJECT or ARRAY Schema.');

    (() => {
      REQUEST().body(STRING());
    }).should.throw('Must be OBJECT or ARRAY Schema.');
  }));

  it('invalid req object should throw', helper.mochaAsync(async () => {
    const schema = OBJECT({
      name: STRING()
    });

    try {
      await REQUEST().params(schema).validate(null);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.message.should.equal('Invalid express req object.');
    }
  }));

  it('object should get converted to schema and verify', helper.mochaAsync(async () => {
    const schema = {
      name: STRING()
    };

    const req = {
      params: {},
      query: {},
      body: {
        name: 'Jane Doe'
      }
    };

    const result = await REQUEST().body(schema).validate(req);
    result.should.deepEqual(req);
  }));

  it('invalid data should throw', helper.mochaAsync(async () => {
    const schema = OBJECT({
      name: STRING()
    }).required(true);

    const req = {
      params: {},
      query: {},
      body: {}
    };

    try {
      await REQUEST().params(schema).validate(req);
      should.equal(true, false, 'Should throw');
    } catch (err) {
      err.should.deepEqual({
        params: 'Object is empty.'
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

  it('valid data should verify', helper.mochaAsync(async () => {
    const req = {
      params: {
        id: '20'
      },
      query: {},
      body: {
        name: 'Jane Doe'
      }
    };

    const result = await REQUEST()
      .params(OBJECT({
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

  it('optional body should verify', helper.mochaAsync(async () => {
    const schema = REQUEST()
      .body(OBJECT({
        names: ARRAY(OBJECT({}))
      }).required(false));

    const req = {
      params: {},
      query: {},
      body: {},
    };

    const result = await schema.validate(req, helper.DEFAULT_OPTIONS);
  }));

  it('body should be required by default', helper.mochaAsync(async () => {
    const schema = REQUEST()
      .body({
        names: ARRAY(OBJECT({}))
      });

    const req = {
      params: {},
      query: {},
      body: {},
    };

    let error;
    const result = await schema.validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
      error = err;
    });
    error.should.have.property('body', 'Object is empty.');
  }));

  it('body object should be required by default', helper.mochaAsync(async () => {
    const schema = REQUEST()
      .body(OBJECT({
        names: ARRAY(OBJECT({}))
      }));

    const req = {
      params: {},
      query: {},
      body: {},
    };

    let error;
    const result = await schema.validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
      error = err;
    });
    error.should.have.property('body', 'Object is empty.');
  }));

  it('params data without schema definition should fail', async () => {
    const req = {
      params: {
        name: 'test'
      },
      query: {},
      body: {}
    };
    let error;
    const result = await REQUEST().validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
      error = err;
    });
    error.should.have.property('params', 'URI parameters are not allowed.');
  });

  it('query data without schema definition should fail', async () => {
    const req = {
      params: {},
      query: {
        name: 'test'
      },
      body: {}
    };
    let error;
    const result = await REQUEST().validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
      error = err;
    });
    error.should.have.property('query', 'Query parameters are not allowed.');
  });

  it('body data without schema definition should fail', async () => {
    const req = {
      params: {},
      query: {},
      body: {
        name: 'test'
      },
    };
    let error;
    const result = await REQUEST().validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
      error = err;
    });
    error.should.have.property('body', 'Body parameters are not allowed.');
  });

  it.only('toObject() should verify', async () => {
    const schema = REQUEST()
      .params({
        userid: INTEGER()
      })
      .query({
        deleted: BOOLEAN()
      })
      .body({
        name: STRING()
      })
      .description('A very nice route.');
    console.log(schema.toObject());
  });
});
