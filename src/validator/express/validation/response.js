const validateResponse = async (res, { status, body, message }) => {
  const errors = {};
  let valid = true;

  if (res.status !== status) {
    errors.status = message.get('express_invalid_status_code', {
      expected: status,
      actual: res.status
    });
    valid = false;
  }

  if (body) {
    try {
      res.body = await body.validate(res.body);
    } catch (err) {
      errors.body = err;
      valid = false;
    }
  }

  if (valid) {
    return res;
  } else {
    throw errors;
  }
};
const validateResponseSync = (res, { status, body, message }) => {
  const errors = {};
  let valid = true;

  if (res.status !== status) {
    errors.status = message.get('express_invalid_status_code', {
      expected: status,
      actual: res.status
    });
    valid = false;
  }

  if (body) {
    try {
      res.body = body.validateSync(res.body);
    } catch (err) {
      errors.body = err;
      valid = false;
    }
  }

  if (valid) {
    return res;
  } else {
    throw errors;
  }
};

module.exports = {
  validateResponse,
  validateResponseSync
};
