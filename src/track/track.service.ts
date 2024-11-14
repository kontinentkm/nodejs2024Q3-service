//track.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './interfaces/track.interface';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  // Получить все треки
  async getAllTracks(): Promise<Track[]> {
    return this.prisma.track.findMany({
      include: {
        artist: true, // Включаем информацию об артисте
        album: true, // Включаем информацию об альбоме
      },
    });
  }

  // Получить трек по ID
  async getTrackById(id: string): Promise<Track | null> {
    return this.prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
      },
    });
  }

  // Создать новый трек
  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId,
        albumId: createTrackDto.albumId ?? null,
        duration: createTrackDto.duration,
      },
    });
  }

  // Обновить трек по ID
  async updateTrack(
    id: string,
    updateTrackDto: Partial<CreateTrackDto>,
  ): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
  }

  // Удалить трек по ID
  async deleteTrack(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.prisma.track.delete({
      where: { id },
    });
  }

  // Удалить artistId для всех треков артиста
  async removeArtistFromTracks(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  // Очистить albumId для всех треков с указанным albumId
  async clearAlbumId(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
