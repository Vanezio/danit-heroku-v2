import { ValidationError } from 'class-validator';

export class HttpError extends Error {
  public statusCode: number;

  constructor(message?: string, statusCode: number = 400) {
    super(message);

    this.statusCode = statusCode;
  }
}

export class HttpValidationError extends HttpError {
  constructor(public errors: ValidationError[]) {
    super('Validation error', 400);
  }
}
