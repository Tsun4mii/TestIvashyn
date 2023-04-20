import { HttpException, HttpStatus } from '@nestjs/common';
import { UserNotFoundError } from '../service/user.UserNotFound.service.error';

export class UserNotFoundHttpException extends HttpException {
  constructor(serviceException: UserNotFoundError) {
    super(
      {
        name: 'USER_NOT_FOUND',
        message: serviceException.message,
        data: serviceException.data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
