const should = require('should');
const helper = require('../helper');

const Validator = require('../../index').ExpressValidator;

const validator = Validator();

describe('Request()', () => {
  it('invalid schema should throw', async () => {
    await helper.throw(
      () => validator.Request().params(null),
      'Invalid schema.'
    );
    await helper.throw(
      () => validator.Request().query(null),
      'Invalid schema.'
    );
    await helper.throw(() => validator.Request().body(null), 'Invalid schema.');
  });

  it('unknown schema should throw', async () => {
    const message = 'Must be Object or Array Schema.';
    await helper.throw(
      () => validator.Request().params(validator.String()),
      message
    );
    await helper.throw(
      () => validator.Request().query(validator.String()),
      message
    );
    await helper.throw(
      () => validator.Request().body(validator.String()),
      message
    );
  });

  it('invalid req object should throw', async () => {
    await helper.throw(
      validator.Request({ name: validator.String() }).validate(null),
      'Invalid express req object.'
    );
  });

  it('object should get converted to schema and verify', async () => {
    const schema = { name: validator.String() };

    const req = { params: {}, query: {}, body: { name: 'Jane Doe' } };

    const result = await validator
      .Request()
      .body(schema)
      .validate(req);
    result.should.deepEqual(req);
  });

  it('invalid data should throw', async () => {
    const schema = validator
      .Object({ name: validator.String() })
      .required(true);

    const req = { params: {}, query: {}, body: {} };

    await helper.throw(
      validator
        .Request()
        .params(schema)
        .validate(req),
      { params: 'Object is empty.' }
    );
    await helper.throw(
      validator
        .Request()
        .query(schema)
        .validate(req),
      { query: 'Object is empty.' }
    );
    await helper.throw(
      validator
        .Request()
        .body(schema)
        .validate(req),
      { body: 'Object is empty.' }
    );
  });

  it('valid data should verify', async () => {
    const req = {
      params: { id: '20' },
      query: {},
      body: { name: 'Jane Doe' }
    };

    const result = await validator
      .Request()
      .params(validator.Params({ id: validator.Integer() }))
      .body(validator.Body({ name: validator.String() }))
      .query(validator.Query({ deleted: validator.Boolean() }))
      .validate(req);

    result.should.deepEqual({
      params: { id: 20 },
      query: {},
      body: { name: 'Jane Doe' }
    });
  });

  it('optional body should verify', async () => {
    const schema = validator
      .Request()
      .body(
        validator
          .Body({ names: validator.Array(validator.Object({})) })
          .required(false)
      );

    const req = { params: {}, query: {}, body: {} };
    const result = await schema.validate(req);
  });

  it('body should be required by default', async () => {
    const schema = validator
      .Request()
      .body({ names: validator.Array(validator.Object({})) });

    const req = { params: {}, query: {}, body: {} };

    await helper.throw(schema.validate(req), {
      body: 'Object is empty.'
    });
  });

  it('body object should be required by default', async () => {
    const schema = validator
      .Request()
      .body(validator.Body({ names: validator.Array(validator.Object({})) }));

    const req = { params: {}, query: {}, body: {} };

    await helper.throw(schema.validate(req), { body: 'Object is empty.' });
  });

  it('params data without schema definition should fail', async () => {
    const req = { params: { name: 'test' }, query: {}, body: {} };
    await helper.throw(validator.Request().validate(req), {
      params: 'URI parameters are not allowed.'
    });
  });

  it('query data without schema definition should fail', async () => {
    const req = { params: {}, query: { name: 'test' }, body: {} };
    await helper.throw(validator.Request().validate(req), {
      query: 'Query parameters are not allowed.'
    });
  });

  it('body data without schema definition should fail', async () => {
    const req = { params: {}, query: {}, body: { name: 'test' } };
    await helper.throw(validator.Request().validate(req), {
      body: 'Body parameters are not allowed.'
    });
  });

  it('toObject() should verify', async () => {
    const schema = validator
      .Request()
      .params({ userid: validator.Integer() })
      .query({ deleted: validator.Boolean() })
      .body({ name: validator.String() })
      .description('A very nice route.');
    schema.toObject().should.deepEqual({
      type: 'request',
      required: true,
      description: 'A very nice route.',
      params: {
        userid: {
          required: true,
          type: 'integer'
        }
      },
      query: {
        deleted: {
          required: true,
          type: 'boolean'
        }
      },
      body: {
        'application/json': {
          type: 'object',
          required: true,
          empty: false,
          properties: {
            name: {
              empty: false,
              required: true,
              trim: true,
              type: 'string'
            }
          }
        }
      }
    });
  });

  it('toObject() type raml should verify', async () => {
    const schema = validator
      .Request()
      .params({ userid: validator.Integer() })
      .query({ deleted: validator.Boolean() })
      .body({ name: validator.String() })
      .description('A very nice route.');
    schema.toObject({ type: 'raml' }).should.be.type('object');
  });

  it('should return default query parameter', async () => {
    const req = { params: {}, query: {}, body: {} };
    const expected = { params: {}, query: { test: true }, body: {} };
    const schema = validator.Request().query({
      test: validator
        .Boolean()
        .required(false)
        .default(true)
    });
    const actual = await schema.validate(req);
    actual.should.deepEqual(expected);
  });

  it('should return one default query parameter', async () => {
    const req = { params: {}, query: {}, body: {} };
    const expected = { params: {}, query: { optional: true }, body: {} };
    const actual = await validator
      .Request()
      .query({
        optional: validator
          .Boolean()
          .required(false)
          .default(true),
        required: validator.Boolean().required(true)
      })
      .validate(req);
    actual.should.deepEqual(expected);
  });
});
