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
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string) {
    if (!id || id.length !== 36) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const artist = this.artistService.getArtistById(id);
      return artist;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  createArtist(@Body() createArtistDto: CreateArtistDto) {
    try {
      return this.artistService.createArtist(createArtistDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ) {
    // Проверка на неправильный формат ID
    if (!id || id.length !== 36) {
      // Например, проверка длины UUID
      throw new BadRequestException('Invalid ID format');
    }

    // Логика обновления художника
    const updatedArtist = this.artistService.updateArtist(id, updateArtistDto);

    if (!updatedArtist) {
      throw new NotFoundException('Artist not found');
    }

    return updatedArtist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Устанавливаем код 204 в случае успешного удаления
  deleteArtist(@Param('id') id: string) {
    // Проверка на неправильный формат ID
    if (!id || id.length !== 36) {
      throw new BadRequestException('Invalid ID format');
    }

    // Используем getArtistById для проверки существования артиста
    this.artistService.getArtistById(id);

    // Удаление артиста
    this.artistService.deleteArtist(id);

    // Сброс artistId для треков и альбомов
    this.trackService.removeArtistFromTracks(id);
    this.albumService.removeArtistFromAlbums(id);

    return { message: 'Artist successfully deleted' };
  }
}
