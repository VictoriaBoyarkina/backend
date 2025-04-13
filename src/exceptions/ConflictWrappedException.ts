import { HttpStatus } from '@nestjs/common';
import { WrappedHttpException } from './exceptionWrapper';

export class ConflictWrappedException extends WrappedHttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
