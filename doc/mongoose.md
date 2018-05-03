# MongooseValidator

Inherits all types from the default validator.

``` javascript
const { MongooseValidator } = require('@korbiniankuhn/validator');
const validator = MongooseValidator();

const schema = new Schema({
  name: {
    type: String,
    index: true,
    required: true,
    validate: validator.String().min(5).max(50).validate();
  },
  age: {
    type: Integer,
    validate: validator.Integer().greater(0).validateSync();
  },
});
```