//auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service'; // Зависимость от модуля пользователя
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    PrismaModule,
    AuthGuard,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, UserService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
