//protected/protected.module.ts
import { Module } from '@nestjs/common';
import { ProtectedController } from './protected.controller';
import { UserService } from '../user/user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProtectedController],
  providers: [UserService],
})
export class ProtectedModule {}
