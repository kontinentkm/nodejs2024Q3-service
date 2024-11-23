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
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { isUUID } from 'class-validator';
import { LoggingService } from '../logging/logging/logging.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('album')
@UseGuards(AuthGuard)
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  async getAllAlbums() {
    this.logger.log('Fetching all albums');
    try {
      const albums = await this.albumService.getAllAlbums();
      this.logger.log('Successfully fetched all albums');
      return albums;
    } catch (error) {
      this.logger.error('Error fetching all albums', error.stack);
      throw error;
    }
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    this.logger.log(`Fetching album by ID: ${id}`);
    try {
      if (!isUUID(id)) {
        this.logger.warn(`Invalid ID format: ${id}`);
        throw new BadRequestException('Invalid ID format');
      }
      const album = await this.albumService.getAlbumById(id);
      if (!album) {
        this.logger.warn(`Album not found: ${id}`);
        throw new NotFoundException();
      }
      this.logger.log(`Successfully fetched album with ID: ${id}`);
      return album;
    } catch (error) {
      this.logger.error(`Error fetching album by ID: ${id}`, error.stack);
      throw error;
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    this.logger.log('Creating new album');
    try {
      const album = await this.albumService.createAlbum(createAlbumDto);
      this.logger.log(`Successfully created album: ${album.id}`);
      return album;
    } catch (error) {
      this.logger.error('Error creating new album', error.stack);
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: CreateAlbumDto,
  ) {
    this.logger.log(`Updating album with ID: ${id}`);
    try {
      if (!isUUID(id)) {
        this.logger.warn(`Invalid ID format: ${id}`);
        throw new BadRequestException('Invalid ID format');
      }
      const album = await this.albumService.updateAlbum(id, updateAlbumDto);
      if (!album) {
        this.logger.warn(`Album not found: ${id}`);
        throw new NotFoundException();
      }
      this.logger.log(`Successfully updated album with ID: ${id}`);
      return album;
    } catch (error) {
      this.logger.error(`Error updating album with ID: ${id}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string) {
    this.logger.log(`Deleting album with ID: ${id}`);
    try {
      if (!isUUID(id)) {
        this.logger.warn(`Invalid ID format: ${id}`);
        throw new BadRequestException('Invalid ID format');
      }
      await this.albumService.deleteAlbum(id);
      this.logger.log(`Successfully deleted album with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting album with ID: ${id}`, error.stack);
      throw error;
    }
  }
}
