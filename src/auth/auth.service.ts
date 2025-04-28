import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../user/schema/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedWrappedException } from 'src/exceptions/UnauthorizedWrappedException';
import { ConflictWrappedException } from 'src/exceptions/ConflictWrappedException';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: SignupDto) {
    const existingUser = await this.userModel.findOne({
      $or: [{ nickname: registerDto.nickname }, { email: registerDto.email }],
    });

    if (existingUser) {
      throw new ConflictWrappedException(
        'Пользователь с таким nickname или email уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = this.generateToken(savedUser);

    return {
      accessToken: token,
      user: {
        id: savedUser._id,
        nickname: savedUser.nickname,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ nickname: loginDto.nickname });

    if (!user) {
      throw new UnauthorizedWrappedException('Неверный nickname или пароль');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedWrappedException('Неверный nickname или пароль');
    }

    user.lastLogin = new Date();
    user.lastActivity = new Date();
    await user.save();

    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: {
        id: user._id,
        nickname: user.nickname,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private generateToken(user: UserDocument) {
    const payload = {
      sub: user._id,
      nickname: user.nickname,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string) {
    return this.userModel.findById(userId);
  }

  async updateLastActivity(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { lastActivity: new Date() },
      { new: true },
    );
  }
}
