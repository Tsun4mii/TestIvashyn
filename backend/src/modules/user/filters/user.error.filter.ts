import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { UserNoImageHttpException } from '../errors/http/user.NoImage.http.error';
import { UserNoImageError } from '../errors/service/user.NoImage.service.error';
import { UserExistError } from '../errors/service/user.UserExist.service.error';
import { UserNotFoundError } from '../errors/service/user.UserNotFound.service.error';
import { UserWrongFormatError } from '../errors/service/user.WrongFormat.service.error';
import { Response } from 'express';
import { UserExistHttpException } from '../errors/http/user.UserExist.http.error';
import { UserNotFoundHttpException } from '../errors/http/user.UserNotFound.http.error';
import { UserWrongFormatHttpException } from '../errors/http/user.WrongFormat.http.error';

@Catch(
  UserNoImageError,
  UserExistError,
  UserNotFoundError,
  UserWrongFormatError,
)
export class UserHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException: HttpException;
    if (exception instanceof UserNoImageError) {
      httpException = new UserNoImageHttpException(exception);
    } else if (exception instanceof UserExistError) {
      httpException = new UserExistHttpException(exception);
    } else if (exception instanceof UserNotFoundError) {
      httpException = new UserNotFoundHttpException(exception);
    } else if (exception instanceof UserWrongFormatError) {
      httpException = new UserWrongFormatHttpException(exception);
    }

    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }
}
