// src\track\track.service.ts
import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './interfaces/track.interface';
import { v4 as uuidv4 } from 'uuid'; // Импорт функции uuidv4 для генерации UUID

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  getAllTracks(): Track[] {
    return this.tracks;
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  createTrack(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(), // Генерация уникального UUID
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  updateTrack(
    id: string,
    updateTrackDto: Partial<CreateTrackDto>,
  ): Track | null {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      Object.assign(track, updateTrackDto);
      return track;
    }
    return null;
  }

  deleteTrack(id: string): void {
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }

  // метод для установки artistId на null для всех треков артиста
  removeArtistFromTracks(artistId: string) {
    this.tracks = this.tracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }

  // метод для установки albumId в null для треков с указанным albumId
  clearAlbumId(albumId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.albumId === albumId ? { ...track, albumId: null } : track,
    );
  }
}
