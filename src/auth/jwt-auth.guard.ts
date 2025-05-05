import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedWrappedException } from 'src/exceptions/UnauthorizedWrappedException';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedWrappedException('Пользователь не авторизован');
    }
    return user;
  }
}
