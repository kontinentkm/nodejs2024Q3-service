// src/album/album.module.ts
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from '../track/track.module';
import { PrismaService } from 'prisma/prisma.service';
import { LoggingModule } from '../logging/logging.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TrackModule, LoggingModule, AuthModule],
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService],
})
export class AlbumModule {}
