export class UserNotFoundError extends Error {
  data?: string;
  constructor(message: string, data?: string) {
    super(message);
    this.name = 'User Not Found';
    this.data = data;
  }
}
