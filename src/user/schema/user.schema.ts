import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from './role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: [
      Role.FRONTEND_DEVELOPER,
      Role.BACKEND_DEVELOPER,
      Role.DESIGNER,
      Role.HR,
      Role.MANAGER,
      Role.QA_ENGINEER,
    ],
  })
  role: string;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ default: Date.now })
  lastActivity: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
