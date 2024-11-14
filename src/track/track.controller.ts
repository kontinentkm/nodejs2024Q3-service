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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './interfaces/track.interface';
import { validate as isUUID } from 'uuid';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllTracks(): Promise<Track[]> {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTrackById(@Param('id') id: string): Promise<Track> {
    if (!isUUID(id)) throw new BadRequestException('Invalid ID format');
    const track = await this.trackService.getTrackById(id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: Partial<CreateTrackDto>,
  ): Promise<Track> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const updatedTrack = await this.trackService.updateTrack(
      id,
      updateTrackDto,
    );
    if (!updatedTrack) throw new NotFoundException('Track not found');
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string): Promise<void> {
    const track = await this.trackService.getTrackById(id);
    if (!track) throw new NotFoundException('Track not found');
    await this.trackService.deleteTrack(id);
  }
}
