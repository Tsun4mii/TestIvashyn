import { HttpException, HttpStatus } from '@nestjs/common';
import { UserExistError } from '../service/user.UserExist.service.error';

export class UserExistHttpException extends HttpException {
  constructor(serviceException: UserExistError) {
    super(
      {
        name: 'USER_EXIST',
        message: serviceException.message,
        data: serviceException.data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
