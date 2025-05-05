import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const user = configService.get<string>('DB_USER');
        const pass = configService.get<string>('DB_PASS');
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<string>('DB_PORT');
        const name = configService.get<string>('DB_NAME');

        return {
          uri: `mongodb://${user}:${pass}@${host}:${port}/${name}?authSource=admin`,
        };
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
