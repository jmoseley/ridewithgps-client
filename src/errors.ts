export class NoUserIdError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class HttpError extends Error {
  constructor(public code: number, message?: string) {
    super(message);
  }
}
