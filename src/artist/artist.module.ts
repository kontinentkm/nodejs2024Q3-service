// src/artist/artist.module.ts

import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, TrackService, AlbumService, PrismaService],
})
export class ArtistModule {}
