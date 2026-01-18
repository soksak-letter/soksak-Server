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

// 401: Unauthorized
export class unauthorizedError extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 401, errorCode, data);
  }
}

// 403: Forbidden
export class ForbiddenError extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 403, errorCode, data);
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

// 429: Too Many Requests
export class TooManyRequests extends BaseError {
  constructor(errorCode, message, data = null) {
    super(message, 429, errorCode, data);
  }
}

export class ReferenceNotFoundError extends NotFoundError {
  constructor(code, message, data = null) {
      super(code, message, data);
  }
}

export class DuplicatedValueError extends ConflictError {
  constructor(code, message, data = null){
    super(code, message, data);
  }
}