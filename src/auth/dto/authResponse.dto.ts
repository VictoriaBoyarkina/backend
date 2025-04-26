import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/schema/role.enum';
import { Types } from 'mongoose';

@Exclude()
export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: Types.ObjectId;

  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty({ enum: Role })
  @Expose()
  role: Role;

  @ApiProperty()
  @Expose()
  lastLogin: Date;

  @ApiProperty()
  @Expose()
  lastActivity: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
