// src/favorites/favorites.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  private favorites = {
    artist: [],
    album: [],
    track: [],
  };

  // Получить все избранные элементы
  async getAllFavorites() {
    return {
      artists: this.favorites.artist,
      albums: this.favorites.album,
      tracks: this.favorites.track,
    };
  }

  // Добавить элемент в избранное
  async addToFavorites(createFavoriteDto: CreateFavoriteDto, type: string) {
    const { id, name } = createFavoriteDto;
    // Проверка на наличие элемента в базе данных (например, поиск в другом сервисе)
    if (!id || !name) {
      throw new NotFoundException(`Invalid ${type} id or name`);
    }

    // Добавляем элемент в избранное
    this.favorites[type].push({ id, name });
    return true;
  }

  // Удалить элемент из избранного
  async removeFromFavorites(id: string, type: string) {
    const index = this.favorites[type].findIndex(
      (favorite) => favorite.id === id,
    );
    if (index === -1) {
      return false; // Элемент не найден
    }

    // Удаляем элемент из массива
    this.favorites[type].splice(index, 1);
    return true;
  }
}
