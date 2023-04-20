export class UserWrongFormatError extends Error {
  data?: string;
  constructor(message: string, data?: string) {
    super(message);
    this.name = 'Wrong photo format';
    this.data = data;
  }
}
