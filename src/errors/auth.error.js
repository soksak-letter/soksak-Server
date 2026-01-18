import { unauthorizedError } from "./base.error.js";

export class AuthError extends unauthorizedError {
  constructor(code, message, data = null) {
    super(code, message, data);
  }
}

export class ExpiredAccessTokenError extends unauthorizedError {
  constructor(code, message, data = null) {
    super(code, message, data);
  }
}

export class NotAccessTokenError extends unauthorizedError {
  constructor(code, message, data = null) {
    super(code, message, data);
  }
}

export class NotRefreshTokenError extends unauthorizedError {
  constructor(code, message, data = null) {
    super(code, message, data);
  }
}