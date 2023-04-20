import { HttpException, HttpStatus } from '@nestjs/common';
import { UserNoImageError } from '../service/user.NoImage.service.error';

export class UserNoImageHttpException extends HttpException {
  constructor(serviceException: UserNoImageError) {
    super(
      {
        name: 'MISSING_IMAGE',
        message: serviceException.message,
        data: serviceException.data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
