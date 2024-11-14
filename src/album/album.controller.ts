// src/album/album.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { isUUID } from 'class-validator';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const album = await this.albumService.getAlbumById(id);
    if (!album) throw new NotFoundException();
    return album;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: CreateAlbumDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const album = await this.albumService.updateAlbum(id, updateAlbumDto);
    if (!album) throw new NotFoundException();
    return album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.albumService.deleteAlbum(id);
  }
}
