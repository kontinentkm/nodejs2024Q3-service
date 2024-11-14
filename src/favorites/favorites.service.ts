// src/favorites/favorites.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  // Получить все избранные элементы
  async getAllFavorites() {
    const favorites = await this.prisma.favorites.findMany({
      include: {
        artist: true, // Включаем данные артиста
        album: true, // Включаем данные альбома
        track: true, // Включаем данные трека
        user: true, // Включаем данные пользователя
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

    // Используем connect для связи с сущностями
    const favorite = await this.prisma.favorites.create({
      data: {
        user: { connect: { id: createFavoriteDto.userId } }, // Пример: подключаем пользователя
        artist: type === 'artist' ? { connect: { id } } : undefined, // Подключаем артистов
        album: type === 'album' ? { connect: { id } } : undefined, // Подключаем альбомы
        track: type === 'track' ? { connect: { id } } : undefined, // Подключаем треки
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
