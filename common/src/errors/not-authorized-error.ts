import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  reason = 'Not authorized';

  constructor() {
    super('Error connecting to database');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}