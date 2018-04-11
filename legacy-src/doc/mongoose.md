# Mongoose schema validation

The validator can also be used for the validation of mongoose schemas.

``` javascript
const schema = new Schema({
  name: {
    type: String,
    index: true,
    required: true,
    validate: async (v) => {
      await validator.String().min(5).max(50).validate(v);
    }
  },
  age: {
    type: Integer,
    validate: async (v) => {
      await validator.Integer().greater(0).validate(v);
    }
  },
});
```