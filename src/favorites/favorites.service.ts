// src/favorites/favorites.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; // Импорт PrismaService
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  // Получить все избранные элементы
  async getAllFavorites() {
    const favorites = await this.prisma.favorites.findMany({
      include: {
        artist: true,
        album: true,
        track: true,
      },
    });

    return favorites;
  }

  // Добавить элемент в избранное
  async addToFavorites(
    id: string,
    type: string,
    createFavoriteDto: CreateFavoriteDto,
  ) {
    // Проверка существования элемента
    let itemExists;
    if (type === 'artist') {
      itemExists = await this.prisma.artist.findUnique({ where: { id } });
    } else if (type === 'album') {
      itemExists = await this.prisma.album.findUnique({ where: { id } });
    } else if (type === 'track') {
      itemExists = await this.prisma.track.findUnique({ where: { id } });
    }

    if (!itemExists) {
      throw new NotFoundException(`${type} not found`);
    }

    // Добавляем элемент в избранное
    const favorite = await this.prisma.favorites.create({
      data: {
        [type]: {
          connect: { id },
        },
        // Убедимся, что добавляем все возможные данные
        name: createFavoriteDto.name,
        artistId: createFavoriteDto.artistId,
        grammy: createFavoriteDto.grammy,
        year: createFavoriteDto.year,
        duration: createFavoriteDto.duration,
      },
    });

    return favorite;
  }

  // Добавить артиста в избранное
  async addArtistToFavorites(
    artistId: string,
    createFavoriteDto: CreateFavoriteDto,
  ) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Добавление артиста в избранное
    const favorite = await this.prisma.favorites.create({
      data: {
        artist: {
          connect: { id: artistId },
        },
        name: createFavoriteDto.name,
        grammy: createFavoriteDto.grammy,
      },
    });

    return favorite;
  }

  // Удалить элемент из избранного
  async removeFromFavorites(id: string, type: string) {
    const favorite = await this.prisma.favorites.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException(`${type} not found in favorites`);
    }

    await this.prisma.favorites.delete({
      where: { id },
    });
    return true;
  }
}
