// src/favorites/favorites.service.ts
import { Injectable } from '@nestjs/common';
import { Favorites } from './interfaces/favorites.interface';

@Injectable()
export class FavoritesService {
  private favorites: Favorites[] = []; // Массив объектов Favorites

  getAllFavorites(): Favorites[] {
    return this.favorites;
  }

  addFavorite(favorite: { type: string; id: string }): Favorites {
    // Находим или создаем новый объект favorites для соответствующего типа (artist, album, track)
    let favoriteList = this.favorites.find((fav) =>
      fav[favorite.type]?.includes(favorite.id),
    );
    if (!favoriteList) {
      // Если нет такого объекта, создаем новый
      favoriteList = { artists: [], albums: [], tracks: [] };
      this.favorites.push(favoriteList);
    }

    // Добавляем в соответствующий массив (artists, albums, или tracks)
    favoriteList[favorite.type].push(favorite.id);

    return favoriteList;
  }

  removeFavorite(id: string): void {
    // Удаляем все записи из каждого типа, в которых встречается id
    this.favorites.forEach((favoriteList) => {
      ['artists', 'albums', 'tracks'].forEach((type) => {
        favoriteList[type] = favoriteList[type].filter((favId) => favId !== id);
      });
    });

    // Убираем пустые объекты
    this.favorites = this.favorites.filter(
      (fav) =>
        fav.artists.length > 0 ||
        fav.albums.length > 0 ||
        fav.tracks.length > 0,
    );
  }
}
