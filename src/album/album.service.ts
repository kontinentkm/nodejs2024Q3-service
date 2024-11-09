// src/album/album.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './interfaces/album.interface';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.find((album) => album.id === id);
  }

  createAlbum(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  updateAlbum(id: string, updateAlbumDto: CreateAlbumDto): Album | null {
    const album = this.albums.find((album) => album.id === id);
    if (album) {
      Object.assign(album, updateAlbumDto);
      return album;
    }
    return null;
  }

  deleteAlbum(id: string): void {
    this.albums = this.albums.filter((album) => album.id !== id);
  }
}
