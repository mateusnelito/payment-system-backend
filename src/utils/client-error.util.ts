import HttpStatusCodes from './http-status-codes.util';

interface errors {
  [key: string]: string[] | Record<string, string[]>;
}

export default class ClientError extends Error {
  public readonly statusCode: number;
  public readonly errors: errors;

  constructor(message: string, errors: errors, statusCode?: number) {
    super(message);
    this.name = 'ClientError';
    this.errors = errors;
    this.statusCode = statusCode ?? HttpStatusCodes.BAD_REQUEST;
  }
}
