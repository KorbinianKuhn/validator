const should = require('should');
const helper = require('../helper');

const Validator = require('../../index').ExpressValidator;

const validator = Validator();

describe.skip('Request()', () => {
  it('invalid schema should throw', async () => {
    await helper.throw(() => validator.Request().params(null), 'Invalid schema.');
    await helper.throw(() => validator.Request().query(null), 'Invalid schema.');
    await helper.throw(() => validator.Request().body(null), 'Invalid schema.');
  });

  it('unknown schema should throw', async () => {
    const message = 'Must be Object or Array Schema.';
    await helper.throw(() => validator.Request().params(validator.String()), message);
    await helper.throw(() => validator.Request().query(validator.String()), message);
    await helper.throw(() => validator.Request().body(validator.String()), message);
  });

  it('invalid req object should throw', async () => {
    await helper.throw(validator.Request({ name: validator.String() }).validate(null), 'Invalid express req object.');
  });

  it('object should get converted to schema and verify', async () => {
    const schema = { name: validator.String() };

    const req = { params: {}, query: {}, body: { name: 'Jane Doe' } };

    const result = await validator.Request().body(schema).validate(req);
    result.should.deepEqual(req);
  });

  it('invalid data should throw', async () => {
    const schema = validator.Object({ name: validator.String() }).required(true);

    const req = { params: {}, query: {}, body: {} };

    await helper.throw(validator.Request().params(schema).validate(req), { params: 'Object is empty.' });
    await helper.throw(validator.Request().query(schema).validate(req), { query: 'Object is empty.' });
    await helper.throw(validator.Request().body(schema).validate(req), { body: 'Object is empty.' });
  });

  it('valid data should verify', async () => {
    const req = {
      params: { id: '20' },
      query: {},
      body: { name: 'Jane Doe' }
    };

    const result = await validator.Request()
      .params(validator.Object({ id: validator.Integer() }))
      .body(validator.Object({ name: validator.String() }))
      .query(validator.Object({ deleted: validator.Boolean() }))
      .validate(req);

    result.should.deepEqual({
      params: { id: 20 },
      query: {},
      body: { name: 'Jane Doe' }
    });
  });

  it('optional body should verify', async () => {
    const schema = validator.Request()
      .body(validator.Object({
        names: validator.Array(validator.Object({}))
      }).required(false));

    const req = {
      params: {},
      query: {},
      body: {},
    };

    const result = await schema.validate(req, helper.DEFAULT_OPTIONS);
  });

  it('body should be required by default', async () => {
    const schema = validator.Request()
      .body({
        names: validator.Array(validator.Object({}))
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
  });

  it('body object should be required by default', async () => {
    const schema = validator.Request()
      .body(validator.Object({
        names: validator.Array(validator.Object({}))
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
  });

  it('params data without schema definition should fail', async () => {
    const req = {
      params: {
        name: 'test'
      },
      query: {},
      body: {}
    };
    let error;
    const result = await validator.Request().validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
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
    const result = await validator.Request().validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
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
    const result = await validator.Request().validate(req, helper.DEFAULT_OPTIONS).catch((err) => {
      error = err;
    });
    error.should.have.property('body', 'Body parameters are not allowed.');
  });

  it.skip('toObject() should verify', async () => {
    const schema = validator.Request()
      .params({
        userid: validator.Integer()
      })
      .query({
        deleted: validator.Boolean()
      })
      .body({
        name: validator.String()
      })
      .description('A very nice route.');
    console.log(schema.toObject());
  });
});
