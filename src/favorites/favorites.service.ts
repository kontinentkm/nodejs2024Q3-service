// src/favorites/favorites.service.ts
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  private favorites = {
    artist: [] as CreateFavoriteDto[],
    album: [] as CreateFavoriteDto[],
    track: [] as CreateFavoriteDto[],
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
  async addToFavorites(
    id: string,
    type: string,
    createFavoriteDto: CreateFavoriteDto,
  ) {
    // Проверяем, если элемент уже есть в избранном
    const existingItem = this.favorites[type].find((item) => item.id === id);
    if (existingItem) {
      throw new UnprocessableEntityException(`${type} already in favorites`);
    }

    // Добавляем элемент в соответствующую категорию
    const item = { id, ...createFavoriteDto }; // Объединяем id с данными из DTO
    this.favorites[type].push(item);
    return true;
  }

  // Добавить артиста в избранное
  async addArtistToFavorites(
    artistId: string,
    createFavoriteDto: CreateFavoriteDto,
  ) {
    const artist = {
      id: artistId,
      name: createFavoriteDto.name,
      grammy: createFavoriteDto.grammy,
    };

    console.log('Adding artist to favorites:', artist); // Для отладки
    this.favorites.artist.push(artist);
    return artist;
  }

  // Удалить элемент из избранного
  async removeFromFavorites(id: string, type: string) {
    const index = this.favorites[type].findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`${type} not found in favorites`);
    }
    this.favorites[type].splice(index, 1);
    return true;
  }
}
