import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  private favorites = [];

  getAllFavorites() {
    return this.favorites;
  }

  addFavorite(favorite: { type: string; id: string }) {
    this.favorites.push(favorite);
    return favorite;
  }

  removeFavorite(id: string) {
    this.favorites = this.favorites.filter((fav) => fav.id !== id);
  }
}
