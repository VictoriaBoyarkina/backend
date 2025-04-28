import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserResponseDto } from './dto/authResponse.dto';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  async register(
    @Body() registerDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.register(registerDto);
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_EXPIRATION),
    });

    return {
      data: {
        user: plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      },
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(loginDto);
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_EXPIRATION),
    });

    return {
      data: {
        user: plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      },
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ status: 200, description: 'Успешный выход из системы' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      data: {
        message: 'Logged out successfully',
      },
    };
  }

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  async getUser(@Request() req) {
    const user = await this.authService.validateUser(req.user.userId);

    return {
      data: {
        user: plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      },
    };
  }
}
