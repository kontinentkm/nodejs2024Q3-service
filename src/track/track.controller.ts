import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
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
  getTrackById(@Param('id') id: string): Track | undefined {
    return this.trackService.getTrackById(id);
  }

  @Post()
  createTrack(@Body() createTrackDto: CreateTrackDto): Track {
    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: Partial<CreateTrackDto>,
  ): Track | null {
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  deleteTrack(@Param('id') id: string): void {
    return this.trackService.deleteTrack(id);
  }
}
