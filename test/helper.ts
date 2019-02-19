import { AssertionError } from 'assert';

export const shouldThrow = (func: () => void, code: string) => {
  let error;
  try {
    func();
  } catch (err) {
    error = err;
  }
  if (!error) {
    throw new AssertionError({ message: 'Did not throw' });
  }
  expect(error).toEqual(code);
};

export const shouldEventuallyThrow = async (promise: Promise<void>, code: string) => {
  let error;
  try {
    await promise;
  } catch (err) {
    error = err;
  }
  if (!error) {
    throw new AssertionError({ message: 'Did not throw' });
  }
  expect(error).toEqual(code);
};

export class Response {
  private _status: number;
  private _json: object;

  status(value: number) {
    this._status = value;
    return this;
  }

  json(object: object) {
    this._json = object;
    return object;
  }
}
