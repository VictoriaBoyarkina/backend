import { HttpStatus } from '@nestjs/common';
import { WrappedHttpException } from './exceptionWrapper';

export class UnauthorizedWrappedException extends WrappedHttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
