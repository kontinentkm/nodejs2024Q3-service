// src/favorites/favorites.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('favs')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // Получить все избранные
  @Get()
  async getAllFavorites() {
    return await this.favoritesService.getAllFavorites();
  }

  // Добавить артиста в избранное
  @Post('artist/:id')
  async addArtistToFavorites(
    @Param('id') id: string, // Получаем ID артиста из параметров URL
    @Body() createFavoriteDto: CreateFavoriteDto, // Данные артиста из тела запроса
  ) {
    return await this.favoritesService.addArtistToFavorites(
      id,
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

  // Удалить артиста, альбом, трек из избранного
  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtistFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'artist');
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'album');
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrackFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeFromFavorites(id, 'track');
  }
}
