export class UserNoImageError extends Error {
  data?: string;
  constructor(message: string, data?: string) {
    super(message);
    this.name = 'NoImage';
    this.data = data;
  }
}
