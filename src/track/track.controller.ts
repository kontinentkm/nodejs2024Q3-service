// src\track\track.controller.ts
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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './interfaces/track.interface';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks(): Track[] {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTrackById(@Param('id') id: string): Track | undefined {
    if (!isUUID(id)) throw new BadRequestException();
    const track = this.trackService.getTrackById(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: Partial<CreateTrackDto>,
  ): Track | null {
    if (!isUUID(id)) {
      // Проверка, является ли ID валидным UUID
      throw new BadRequestException('Invalid ID format'); // Возвращаем 400 ошибку
    }
    const updatedTrack = this.trackService.updateTrack(id, updateTrackDto);
    if (!updatedTrack) throw new NotFoundException();
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string): void {
    const track = this.trackService.getTrackById(id);
    if (!track) throw new NotFoundException();
    this.trackService.deleteTrack(id);
  }
}
