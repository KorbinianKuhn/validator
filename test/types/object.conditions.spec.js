const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const OBJECT = require('../../src/types/object');
const STRING = require('../../src/types/string');
const INTEGER = require('../../src/types/integer');
const _ = require('lodash');

describe('OBJECT(): conditions', () => {
  it('invalid key in condition should fail', helper.mochaAsync(async() => {
    let message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).conditions({
      age: {
        'gt': 'name'
      }
    }));
    message.should.equal(`Object has no key 'age'.`);

    message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).conditions({
      name: {
        'gt': 'age'
      }
    }));
    message.should.equal(`Object has no key 'age'.`);
  }));

  it('invalid condition method should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).conditions({
      name: {
        'invalid': 'name'
      }
    }));
    message.should.equal(`Object has no condition method 'invalid'.`);
  }));

  it('test greater then condition', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).conditions({
      smaller: {
        'gt': 'bigger'
      }
    });

    const invalid = {
      bigger: 10,
      smaller: 5
    }
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual({
      smaller: `must be greater then 'bigger'`
    });

    const valid = {
      bigger: 5,
      smaller: 10
    }
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async() => OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).gt('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `must be greater then 'bigger'`
    });

    result = await OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).gt('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test greater or equal then condition', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).conditions({
      smaller: {
        'gte': 'bigger'
      }
    });

    const invalid = {
      bigger: 10,
      smaller: 5
    }
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual({
      smaller: `must be greater or equal then 'bigger'`
    });

    const valid = {
      bigger: 5,
      smaller: 10
    }
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    const equal = {
      bigger: 10,
      smaller: 10
    }
    result = await object.validate(equal);
    result.should.deepEqual(equal);

    result = await helper.shouldThrow(async() => OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).gte('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `must be greater or equal then 'bigger'`
    });

    result = await OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).gte('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test less then condition', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).conditions({
      smaller: {
        'lt': 'bigger'
      }
    });

    const invalid = {
      bigger: 5,
      smaller: 10
    }
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual({
      smaller: `must be less then 'bigger'`
    });

    const valid = {
      bigger: 10,
      smaller: 5
    }
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async() => OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).lt('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `must be less then 'bigger'`
    });

    result = await OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).lt('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test less or equal then condition', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).conditions({
      smaller: {
        'lte': 'bigger'
      }
    });

    const invalid = {
      bigger: 5,
      smaller: 10
    }
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual({
      smaller: `must be less or equal then 'bigger'`
    });

    const valid = {
      bigger: 10,
      smaller: 5
    }
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    const equal = {
      bigger: 10,
      smaller: 10
    }
    result = await object.validate(equal);
    result.should.deepEqual(equal);

    result = await helper.shouldThrow(async() => OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).lte('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `must be less or equal then 'bigger'`
    });

    result = await OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).lte('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test equals condition', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).conditions({
      smaller: {
        'equals': 'bigger'
      }
    });

    const invalid = {
      bigger: 5,
      smaller: 10
    }
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual({
      smaller: `must equal 'bigger'`
    });

    const valid = {
      bigger: 10,
      smaller: 10
    }
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async() => OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).equals('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `must equal 'bigger'`
    });

    result = await OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).equals('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test multiple conditions', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).equals('bigger', 'smaller').gte('bigger', 'smaller');

    const invalid = {
      bigger: 10,
      smaller: 5
    }
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual({
      bigger: `must equal 'smaller'`
    });

    const valid = {
      bigger: 10,
      smaller: 10
    }
    result = await object.validate(valid);
    result.should.equal(valid);
  }));

  it('conditions with objects and array should skip', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: OBJECT({
        a: INTEGER()
      }),
      smaller: OBJECT({
        b: INTEGER()
      })
    }).lt('bigger', 'smaller');

    const invalid = _.set(_.set({}, 'bigger.a', 10), 'smaller.a', 5);
    let result = await object.validate(invalid);
    result.should.equal(invalid);

    const valid = _.set(_.set({}, 'bigger.a', 10), 'smaller.a', 10);

    result = await object.validate(valid);
    result.should.equal(valid);
  }));

  it('test notEquals then condition', helper.mochaAsync(async() => {
    const object = OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).conditions({
      smaller: {
        'notEquals': 'bigger'
      }
    });

    const invalid = {
      bigger: 10,
      smaller: 10
    }
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual({
      smaller: `must not equal 'bigger'`
    });

    const valid = {
      bigger: 10,
      smaller: 5
    }
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    result = await helper.shouldThrow(async() => OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).notEquals('smaller', 'bigger').validate(invalid));
    result.should.deepEqual({
      smaller: `must not equal 'bigger'`
    });

    result = await OBJECT({
      bigger: INTEGER(),
      smaller: INTEGER()
    }).notEquals('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test dependsOn condition', helper.mochaAsync(async() => {
    // Object with conditions function
    let object = OBJECT({
      bigger: INTEGER().required(false),
      smaller: INTEGER().required(false)
    }).conditions(_.set({}, 'smaller.dependsOn', 'bigger'));

    const invalid = _.set({}, 'smaller', 10);
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `depends on 'bigger'`));

    let valid = _.set(_.set({}, 'bigger', 10), 'smaller', 5);
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    // Object with dependsOn function
    object = OBJECT({
      bigger: INTEGER().required(false),
      smaller: INTEGER().required(false)
    }).dependsOn('smaller', 'bigger');
    result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `depends on 'bigger'`));

    result = await object.validate(valid);
    result.should.deepEqual(valid);

    valid = _.set({}, 'bigger', 10);
    result = await object.validate(valid);
    result.should.deepEqual(valid);
  }));

  it('test xor condition', helper.mochaAsync(async() => {
    // Object with conditions function
    let object = OBJECT({
      bigger: INTEGER().required(false),
      smaller: INTEGER().required(false)
    }).conditions(_.set({}, 'smaller.xor', 'bigger'));

    const invalid = _.set(_.set({}, 'bigger', 10), 'smaller', 5);
    let result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `only 'smaller' or 'bigger' can be set`));

    let valid = _.set({}, 'bigger', 10);
    result = await object.validate(valid);
    result.should.deepEqual(valid);

    valid = _.set({}, 'smaller', 5);
    result = await object.validate(valid);
    result.should.deepEqual(valid);


    // Object with xor function
    object = OBJECT({
      bigger: INTEGER().required(false),
      smaller: INTEGER().required(false)
    }).xor('smaller', 'bigger');

    result = await helper.shouldThrow(async() => object.validate(invalid));
    result.should.deepEqual(_.set({}, 'smaller', `only 'smaller' or 'bigger' can be set`));

    result = await object.xor('smaller', 'bigger').validate(valid);
    result.should.deepEqual(valid);
  }));

});
