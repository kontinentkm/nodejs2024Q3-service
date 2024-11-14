// src/artist/artist.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; // Импорт PrismaService
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from '@prisma/client'; // Импортируем тип Artist от Prisma

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  // Получение всех артистов
  async getAllArtists(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  // Получение артиста по ID
  async getArtistById(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  // Создание нового артиста
  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = createArtistDto;

    // Проверка данных
    if (!name || typeof grammy !== 'boolean') {
      throw new BadRequestException('Invalid artist data');
    }

    const newArtist = await this.prisma.artist.create({
      data: {
        name,
        grammy,
      },
    });

    return newArtist;
  }

  // Обновление данных артиста
  async updateArtist(
    id: string,
    updateArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    const { name, grammy } = updateArtistDto;

    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: {
        name,
        grammy,
      },
    });

    return updatedArtist;
  }

  // Удаление артиста
  async deleteArtist(id: string): Promise<void> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    // Удаление артиста
    await this.prisma.artist.delete({
      where: { id },
    });
  }
}
