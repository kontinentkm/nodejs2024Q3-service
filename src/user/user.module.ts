// user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { LoggingModule } from '../logging/logging.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, LoggingModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
