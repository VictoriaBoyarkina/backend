import { HttpException, HttpStatus } from '@nestjs/common';

export class WrappedHttpException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    error: string = HttpStatus[statusCode],
  ) {
    super(
      {
        error: {
          message,
          error,
          statusCode,
        },
      },
      statusCode,
    );
  }
}
