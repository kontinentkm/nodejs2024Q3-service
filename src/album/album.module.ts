// src/album/album.module.ts
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from '../track/track.module';
import { PrismaService } from 'prisma/prisma.service'; // Импорт PrismaService

@Module({
  imports: [TrackModule],
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService], // Добавляем PrismaService в провайдеры
})
export class AlbumModule {}
