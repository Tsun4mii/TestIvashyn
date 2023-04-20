export class UserExistError extends Error {
  data?: string;
  constructor(message: string, data?: string) {
    super(message);
    this.name = 'User Exist';
    this.data = data;
  }
}
