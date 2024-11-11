// src/favorites/favorites.controller.ts
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto'; // DTO для обработки входных данных

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // Получить все избранные
  @Get()
  async getAllFavorites() {
    return await this.favoritesService.getAllFavorites();
  }

  // Добавить артистов, альбомы, треки в избранное
  @Post('artist/:id')
  async addArtistToFavorites(
    @Param('id') id: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return await this.favoritesService.addToFavorites(
      id,
      'artist',
      createFavoriteDto,
    );
  }

  @Post('album/:id')
  async addAlbumToFavorites(
    @Param('id') id: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return await this.favoritesService.addToFavorites(
      id,
      'album',
      createFavoriteDto,
    );
  }

  @Post('track/:id')
  async addTrackToFavorites(
    @Param('id') id: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return await this.favoritesService.addToFavorites(
      id,
      'track',
      createFavoriteDto,
    );
  }

  // Удалить артистов, альбомы, треки из избранного
  @Delete('artist/:id')
  async deleteArtistFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'artist');
  }

  @Delete('album/:id')
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'album');
  }

  @Delete('track/:id')
  async deleteTrackFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'track');
  }
}
