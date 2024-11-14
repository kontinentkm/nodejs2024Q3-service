// src/artist/artist.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  @Get()
  async getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string) {
    if (!id || id.length !== 36) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const artist = await this.artistService.getArtistById(id);
      return artist;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    try {
      return await this.artistService.createArtist(createArtistDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ) {
    if (!id || id.length !== 36) {
      throw new BadRequestException('Invalid ID format');
    }

    const updatedArtist = await this.artistService.updateArtist(
      id,
      updateArtistDto,
    );

    if (!updatedArtist) {
      throw new NotFoundException('Artist not found');
    }

    return updatedArtist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string) {
    if (!id || id.length !== 36) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.artistService.getArtistById(id); // Проверка существования артиста

    await this.artistService.deleteArtist(id);

    // Сброс artistId для треков и альбомов
    await this.trackService.removeArtistFromTracks(id);
    await this.albumService.removeArtistFromAlbums(id);

    return { message: 'Artist successfully deleted' };
  }
}
