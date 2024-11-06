import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() updateAlbumDto: CreateAlbumDto) {
    return this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  deleteAlbum(@Param('id') id: string) {
    return this.albumService.deleteAlbum(id);
  }
}
