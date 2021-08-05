export enum HttpStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  FORBIDDEN = 403,
}

export class HttpError extends Error {
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
  status: HttpStatusCodes;
  message: string;
}

export class DatabaseError extends Error {
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
  status: HttpStatusCodes;
  message: string;
}

export class ParseHtmlError extends Error {
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
  status: HttpStatusCodes;
  message: string;
}
