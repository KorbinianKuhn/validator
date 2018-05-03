const middleware = require("./../../../src/validator/express/middleware");
const { Message } = require("./../../../src/utils/message");
const { ValidationError } = require("./../../../src/utils/error");
const { Response } = require("./../../helper");

describe("middleware()", () => {
  const message = Message();
  it("should respond with default settings", () => {
    const err = new ValidationError("message", "details");
    const req = {};
    const res = new Response();
    const next = () => {};

    middleware(message)(err, req, res, next);
    res._status.should.equal(400);
    res._json.should.have.property(
      "message",
      "Invalid input parameters and/or values."
    );
    res._json.should.have.property("details", "details");
  });

  it("should respond without details", () => {
    const err = new ValidationError("message", "details");
    const req = {};
    const res = new Response();
    const next = () => {};

    middleware(message, {
      details: false
    })(err, req, res, next);
    res._status.should.equal(400);
    res._json.should.not.have.property("details");
  });

  it("other error should get nexted", () => {
    const err = new Error("message");
    const req = {};
    const res = new Response();

    middleware(message, {
      details: false
    })(err, req, res, err2 => {
      err.should.equal(err2);
    });
  });

  it("validation err should get nexted", () => {
    const err = new ValidationError("message", "details");
    const req = {};
    const res = new Response();

    middleware(message, {
      next: true
    })(err, req, res, err2 => {
      err.should.equal(err2);
    });
    res._status.should.equal(400);
    res._json.should.have.property("details");
  });
});
