import { unauthorizedError } from "./base.error.js";

export class AuthError extends unauthorizedError {
  constructor(message, data = null) {
    super("AUTH_401_01", message, data);
  }
}

export class ExpiredAccessTokenError extends unauthorizedError {
  constructor(message, data = null) {
    super("AUTH_401_02", message, data);
  }
}

export class NotAccessTokenError extends unauthorizedError {
  constructor(message, data = null) {
    super("AUTH_401_03", message, data);
  }
}

export class NotRefreshTokenError extends unauthorizedError {
  constructor(message, data = null) {
    super("AUTH_401_04", message, data);
  }
}