//protected/protected.module.ts
import { Module } from '@nestjs/common';
import { ProtectedController } from './protected.controller';
import { UserService } from '../user/user.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProtectedController],
  providers: [UserService],
})
export class ProtectedModule {}
