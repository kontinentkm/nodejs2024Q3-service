// src/album/album.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; // Импортируем PrismaService
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from '@prisma/client'; // Импортируем тип Album от Prisma
import { TrackService } from '../track/track.service'; // Подключаем TrackService

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService, // Используем PrismaService
    private readonly trackService: TrackService,
  ) {}

  async getAllAlbums(): Promise<Album[]> {
    return this.prisma.album.findMany(); // Используем Prisma для получения всех альбомов
  }

  async getAlbumById(id: string): Promise<Album | null> {
    return this.prisma.album.findUnique({
      where: { id },
    }); // Используем Prisma для получения альбома по ID
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      },
    }); // Создаем новый альбом через Prisma
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: CreateAlbumDto,
  ): Promise<Album | null> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`); // Проверка, что альбом существует
    }

    return this.prisma.album.update({
      where: { id },
      data: {
        name: updateAlbumDto.name,
        year: updateAlbumDto.year,
        artistId: updateAlbumDto.artistId || null,
      },
    }); // Обновляем альбом через Prisma
  }

  async deleteAlbum(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`); // Проверка, что альбом существует
    }

    await this.prisma.album.delete({
      where: { id },
    }); // Удаляем альбом через Prisma

    // Устанавливаем albumId на null для всех треков, связанных с альбомом
    await this.trackService.clearAlbumId(id);
  }

  // метод для установки artistId на null для всех альбомов артиста
  async removeArtistFromAlbums(artistId: string): Promise<void> {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    }); // Обновляем все альбомы, связанные с артистом
  }
}
