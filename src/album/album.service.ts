import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  private albums = [];

  getAllAlbums() {
    return this.albums;
  }

  getAlbumById(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  createAlbum(createAlbumDto: CreateAlbumDto) {
    const newAlbum = { id: 'some-uuid', ...createAlbumDto };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  updateAlbum(id: string, updateAlbumDto: CreateAlbumDto) {
    const album = this.albums.find((album) => album.id === id);
    if (album) {
      Object.assign(album, updateAlbumDto);
      return album;
    }
    return null;
  }

  deleteAlbum(id: string) {
    this.albums = this.albums.filter((album) => album.id !== id);
  }
}
