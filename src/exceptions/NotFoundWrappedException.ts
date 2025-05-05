import { HttpStatus } from '@nestjs/common';
import { WrappedHttpException } from './exceptionWrapper';

export class NotFoundWrappedException extends WrappedHttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
