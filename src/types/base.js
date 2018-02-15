const _ = require('lodash');

const _private = Symbol('Private variables');

class BASE {
  constructor() {
    this[_private] = {};
  }

  required(required) {
    this[_private].required = required;
    return this;
  }

  isRequired(options = {}) {
    if (this[_private].required === undefined) {
      return options.requiredAsDefault || false;
    } else {
      return this[_private].required;
    }
  }

  hasRequiredProperty() {
    return this[_private].required !== undefined;
  }

  name(name) {
    if (!name) {
      return this[_private].name;
    } else {
      this[_private].name = name;
      return this;
    }
  }

  description(description) {
    if (!description) {
      return this[_private].description;
    } else {
      this[_private].description = description;
      return this;
    }
  }

  example(example) {
    if (!example) {
      return this[_private].example;
    } else {
      this[_private].example = example;
      return this;
    }
  }

  examples(examples) {
    if (!examples) {
      return this[_private].examples;
    } else {
      this[_private].examples = examples;
      return this;
    }
  }
}

module.exports = BASE;
