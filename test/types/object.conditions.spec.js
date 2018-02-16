const helper = require('./helper');
const _ = require('lodash');
const Validator = require('../../index').Validator;

const validator = Validator();

describe('Object(): conditions', () => {
  it('invalid key in condition should fail', helper.mochaAsync(async () => {
    let message = await helper.shouldThrow(async () => validator.Object({
      name: validator.String()
    }).conditions({
      age: {
        gt: 'name'
      }
    }));
    message.should.equal(`Object has no key 'age'.`);

    message = await helper.shouldThrow(async () => validator.Object({
      name: validator.String()
    }).conditions({
      name: {
        gt: 'age'
      }
    }));
    message.should.equal(`Object has no key 'age'.`);
  }));

  it('invalid condition method should fail', helper.mochaAsync(async () => {
    const message = await helper.shouldThrow(async () => validator.Object({
      name: validator.String()
    }).conditions({
      name: {
        invalid: 'name'
      }
    }));
    message.should.equal(`Object has no condition method 'invalid'.`);
  }));

  it('test greater than condition', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).conditions({
      smaller: {
        gt: 'bigger'
      }
    });

    const invalid = {
      bigger: 10,
      smaller: 5
    };
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      smaller: `Must be greater than bigger.`
    });

    const valid = {
      bigger: 5,
      smaller: 10
    };
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async () => validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).gt('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `Must be greater than bigger.`
    });

    result = await validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).gt('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test greater or equal than condition', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).conditions({
      smaller: {
        gte: 'bigger'
      }
    });

    const invalid = {
      bigger: 10,
      smaller: 5
    };
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      smaller: `Must be greater or equal than bigger.`
    });

    const valid = {
      bigger: 5,
      smaller: 10
    };
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    const equal = {
      bigger: 10,
      smaller: 10
    };
    result = await object.validate(equal);
    result.should.deepEqual(equal);

    result = await helper.shouldThrow(async () => validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).gte('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `Must be greater or equal than bigger.`
    });

    result = await validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).gte('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test less than condition', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).conditions({
      smaller: {
        lt: 'bigger'
      }
    });

    const invalid = {
      bigger: 5,
      smaller: 10
    };
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      smaller: `Must be less than bigger.`
    });

    const valid = {
      bigger: 10,
      smaller: 5
    };
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async () => validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).lt('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `Must be less than bigger.`
    });

    result = await validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).lt('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test less or equal than condition', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).conditions({
      smaller: {
        lte: 'bigger'
      }
    });

    const invalid = {
      bigger: 5,
      smaller: 10
    };
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      smaller: `Must be less or equal than bigger.`
    });

    const valid = {
      bigger: 10,
      smaller: 5
    };
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    const equal = {
      bigger: 10,
      smaller: 10
    };
    result = await object.validate(equal);
    result.should.deepEqual(equal);

    result = await helper.shouldThrow(async () => validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).lte('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `Must be less or equal than bigger.`
    });

    result = await validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).lte('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test equals condition', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).conditions({
      smaller: {
        equals: 'bigger'
      }
    });

    const invalid = {
      bigger: 5,
      smaller: 10
    };
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      smaller: `Must equal bigger.`
    });

    const valid = {
      bigger: 10,
      smaller: 10
    };
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async () => validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).equals('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `Must equal bigger.`
    });

    result = await validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).equals('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test multiple conditions', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).equals('bigger', 'smaller').gte('bigger', 'smaller');

    const invalid = {
      bigger: 10,
      smaller: 5
    };
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      bigger: `Must equal smaller.`
    });

    const valid = {
      bigger: 10,
      smaller: 10
    };
    result = await object.validate(valid);
    result.should.equal(valid);
  }));

  it('conditions with objects and array should skip', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Object({
        a: validator.Integer()
      }),
      smaller: validator.Object({
        b: validator.Integer()
      })
    }).lt('bigger', 'smaller');

    const invalid = _.set(_.set({}, 'bigger.a', 10), 'smaller.a', 5);
    let result = await object.validate(invalid);
    result.should.equal(invalid);

    const valid = _.set(_.set({}, 'bigger.a', 10), 'smaller.a', 10);

    result = await object.validate(valid);
    result.should.equal(valid);
  }));

  it('test notEquals than condition', helper.mochaAsync(async () => {
    const object = validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).conditions({
      smaller: {
        notEquals: 'bigger'
      }
    });

    const invalid = {
      bigger: 10,
      smaller: 10
    };
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual({
      smaller: `Must not equal bigger.`
    });

    const valid = {
      bigger: 10,
      smaller: 5
    };
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async () => validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).notEquals('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `Must not equal bigger.`
    });

    result = await validator.Object({
      bigger: validator.Integer(),
      smaller: validator.Integer()
    }).notEquals('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test dependsOn condition', helper.mochaAsync(async () => {
    // Object with conditions function
    let object = validator.Object({
      bigger: validator.Integer().required(false),
      smaller: validator.Integer().required(false)
    }).conditions(_.set({}, 'smaller.dependsOn', 'bigger'));

    const invalid = _.set({}, 'smaller', 10);
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `Depends on bigger.`));

    let valid = _.set(_.set({}, 'bigger', 10), 'smaller', 5);
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    // Object with dependsOn function
    object = validator.Object({
      bigger: validator.Integer().required(false),
      smaller: validator.Integer().required(false)
    }).dependsOn('smaller', 'bigger');
    result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `Depends on bigger.`));

    result = await object.validate(valid);
    result.should.deepEqual(valid);

    valid = _.set({}, 'bigger', 10);
    result = await object.validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test xor condition', helper.mochaAsync(async () => {
    // Object with conditions function
    let object = validator.Object({
      bigger: validator.Integer().required(false),
      smaller: validator.Integer().required(false)
    }).conditions(_.set({}, 'smaller.xor', 'bigger'));

    const invalid = _.set(_.set({}, 'bigger', 10), 'smaller', 5);
    let result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `Only bigger or smaller can be set.`));

    let valid = _.set({}, 'bigger', 10);
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    valid = _.set({}, 'smaller', 5);
    result = await object.validate(valid);
    result.should.deepEqual(valid);


    // Object with xor function
    object = validator.Object({
      bigger: validator.Integer().required(false),
      smaller: validator.Integer().required(false)
    }).xor('smaller', 'bigger');

    result = await helper.shouldThrow(async () => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `Only bigger or smaller can be set.`));

    result = await object.xor('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));
});
