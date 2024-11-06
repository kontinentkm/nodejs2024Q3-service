import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post('add')
  addFavorite(@Body() favorite: { type: string; id: string }) {
    return this.favoritesService.addFavorite(favorite);
  }

  @Delete(':id')
  removeFavorite(@Param('id') id: string) {
    return this.favoritesService.removeFavorite(id);
  }
}
