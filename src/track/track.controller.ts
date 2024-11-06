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

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string) {
    return this.trackService.getTrackById(id);
  }

  @Post()
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  updateTrack(@Param('id') id: string, @Body() updateTrackDto: CreateTrackDto) {
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  deleteTrack(@Param('id') id: string) {
    return this.trackService.deleteTrack(id);
  }
}
