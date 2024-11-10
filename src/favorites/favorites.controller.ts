// src/favorites/favorites.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // Получить все избранные элементы
  @Get()
  async getAllFavorites() {
    const favorites = await this.favoritesService.getAllFavorites();
    return favorites;
  }

  // Добавить артиста в избранное
  @Post('artist')
  async addArtistToFavorites(@Body() createFavoriteDto: CreateFavoriteDto) {
    const result = await this.favoritesService.addToFavorites(
      createFavoriteDto,
      'artist',
    );
    if (result) {
      return { statusCode: 201, message: 'Artist added to favorites' };
    }
    throw new UnprocessableEntityException('Artist does not exist');
  }

  // Добавить альбом в избранное
  @Post('album')
  async addAlbumToFavorites(@Body() createFavoriteDto: CreateFavoriteDto) {
    const result = await this.favoritesService.addToFavorites(
      createFavoriteDto,
      'album',
    );
    if (result) {
      return { statusCode: 201, message: 'Album added to favorites' };
    }
    throw new UnprocessableEntityException('Album does not exist');
  }

  // Добавить трек в избранное
  @Post('track')
  async addTrackToFavorites(@Body() createFavoriteDto: CreateFavoriteDto) {
    const result = await this.favoritesService.addToFavorites(
      createFavoriteDto,
      'track',
    );
    if (result) {
      return { statusCode: 201, message: 'Track added to favorites' };
    }
    throw new UnprocessableEntityException('Track does not exist');
  }

  // Удалить артиста из избранного
  @Delete('artist/:id')
  async deleteArtistFromFavorites(@Param('id') id: string) {
    const result = await this.favoritesService.removeFromFavorites(
      id,
      'artist',
    );
    if (!result) {
      throw new NotFoundException('Artist not found in favorites');
    }
    return { statusCode: 201, message: 'Artist removed from favorites' };
  }

  // Удалить альбом из избранного
  @Delete('album/:id')
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    const result = await this.favoritesService.removeFromFavorites(id, 'album');
    if (!result) {
      throw new NotFoundException('Album not found in favorites');
    }
    return { statusCode: 201, message: 'Album removed from favorites' };
  }

  // Удалить трек из избранного
  @Delete('track/:id')
  async deleteTrackFromFavorites(@Param('id') id: string) {
    const result = await this.favoritesService.removeFromFavorites(id, 'track');
    if (!result) {
      throw new NotFoundException('Track not found in favorites');
    }
    return { statusCode: 201, message: 'Track removed from favorites' };
  }
}
