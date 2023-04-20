import { HttpException, HttpStatus } from '@nestjs/common';
import { UserWrongFormatError } from '../service/user.WrongFormat.service.error';

export class UserWrongFormatHttpException extends HttpException {
  constructor(serviceException: UserWrongFormatError) {
    super(
      {
        name: 'WRONG_PHOTO_FORMAT',
        message: serviceException.message,
        data: serviceException.data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
