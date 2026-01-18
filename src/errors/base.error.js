export class BaseError extends Error {
  constructor(message, status, errorCode, data = null) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.reason = message;
    this.data = data;
  }
}

// 400: Bad Request
export class BadRequestError extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 400, errorCode, data);
  }
}

// 401: unauthorized
export class unauthorizedError extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 401, errorCode, data);
  }
}

// 404: Not Found
export class NotFoundError extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 404, errorCode, data);
  }
}

// 409: Conflict (이미 존재함 등)
export class ConflictError extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 409, errorCode, data);
  }
}

// 500: Internal Server Error
export class InternalServerError extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 500, errorCode, data);
  }
}