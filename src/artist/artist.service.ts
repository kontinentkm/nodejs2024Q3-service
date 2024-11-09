import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './interfaces/artist.interface';
import { v4 as uuidv4 } from 'uuid'; // Импорт функции uuidv4 для генерации UUID

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  // Получение всех артистов
  getAllArtists(): Artist[] {
    return this.artists;
  }

  // Получение артиста по ID
  getArtistById(id: string): Artist | void {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  // Создание нового артиста
  createArtist(createArtistDto: CreateArtistDto): Artist {
    if (!createArtistDto.name || typeof createArtistDto.grammy !== 'boolean') {
      throw new BadRequestException('Invalid artist data');
    }
    const newArtist: Artist = {
      id: uuidv4(), // Генерация уникального UUID
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  // Обновление данных артиста
  updateArtist(id: string, updateArtistDto: CreateArtistDto): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    if (!updateArtistDto.name || typeof updateArtistDto.grammy !== 'boolean') {
      throw new BadRequestException('Invalid update data');
    }
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  // Удаление артиста
  deleteArtist(id: string): void {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }
    this.artists.splice(artistIndex, 1);
  }
}
