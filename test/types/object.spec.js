const assert = require('assert');
const should = require('should');
const helper = require('./helper');
const OBJECT = require('../../src/types/object');
const STRING = require('../../src/types/string');
const INTEGER = require('../../src/types/integer');

describe('OBJECT()', function () {
  it('no object should throw', () => {
    (() => {
      OBJECT()
    }).should.throw('Missing object.');
  });

  it('invalid object should throw', () => {
    (() => {
      OBJECT(['test'])
    }).should.throw('Invalid object.');
  });

  it('required but null should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).validate(null, helper.DEFAULT_OPTIONS));
    message.should.equal(`Required but is null.`);
  }));

  it('null and undefined should verify', helper.mochaAsync(async() => {
    let result = await OBJECT({
      name: STRING()
    }).validate(null);
    should.equal(result, null);

    result = await OBJECT({
      name: STRING()
    }).validate(undefined);
    should.equal(result, undefined);
  }));

  it('invalid data type should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).validate(['test'], helper.DEFAULT_OPTIONS));
    message.should.equal(`Must be object.`);
  }));

  it('invalid data should fail', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });

    let message = await helper.shouldThrow(async() => object.validate({}, helper.DEFAULT_OPTIONS));
    message.should.equal('Object is empty.');

    message = await helper.shouldThrow(async() => object.validate({
      name: 10
    }, helper.DEFAULT_OPTIONS));
    message.should.deepEqual({
      name: 'Must be string but is number.'
    });

  }));

  it('valid data should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });

    let result = await object.validate({
      name: 'Jane Doe'
    }, helper.DEFAULT_OPTIONS);
    result.should.deepEqual({
      name: 'Jane Doe'
    });

    result = await object.validate({
      name: 'John Doe'
    });
    result.should.deepEqual({
      name: 'John Doe'
    });
  }));

  it('parsed string should fail', helper.mochaAsync(async() => {
    const message = await helper.shouldThrow(async() => OBJECT({
      name: STRING()
    }).validate('invalid', {
      parseToType: true
    }));
    message.should.equal('Must be object.');
  }));

  it('parsed string should verify', helper.mochaAsync(async() => {
    const result = await OBJECT({
      name: STRING()
    }).validate('{"name":"Jane Doe"}', {
      parseToType: true
    });

    result.should.deepEqual({
      name: 'Jane Doe'
    });
  }));

  it('invalid default value should throw', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    const result = await helper.shouldThrow(async() => object.defaultValue('invalid'));
    result.message.should.equal('Must be object.');
  }));

  it('valid default value should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    });
    let result = await object.defaultValue({
      name: 'John Doe'
    }).validate();
    result.should.deepEqual({
      name: 'John Doe'
    });

    result = await object.defaultValue({
      name: 'John Doe'
    }).validate({
      name: 'Jane Doe'
    });
    result.should.deepEqual({
      name: 'Jane Doe'
    });
  }));

  it('empty should verify', helper.mochaAsync(async() => {
    const object = OBJECT({
      name: STRING()
    }, {
      noEmptyArrays: true
    });

    let result = await helper.shouldThrow(async() => await object.empty(false).validate({}));
    result.should.equal('Object is empty.');

    result = await object.empty(true).validate({});
    result.should.deepEqual({});
  }));

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
    }).equals('bigger', 'smaller');

    const invalid = {
      bigger: {
        a: 10
      },
      smaller: {
        b: 5
      }
    }
    let result = await object.validate(invalid);
    result.should.equal(invalid);

    const valid = {
      bigger: {
        a: 10
      },
      smaller: {
        b: 10
      }
    }
    result = await object.validate(valid);
    result.should.equal(valid);
  }));
});
