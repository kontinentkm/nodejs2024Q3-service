import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {
  private tracks = [];

  getAllTracks() {
    return this.tracks;
  }

  getTrackById(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  createTrack(createTrackDto: CreateTrackDto) {
    const newTrack = { id: 'some-uuid', ...createTrackDto };
    this.tracks.push(newTrack);
    return newTrack;
  }

  updateTrack(id: string, updateTrackDto: CreateTrackDto) {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      Object.assign(track, updateTrackDto);
      return track;
    }
    return null;
  }

  deleteTrack(id: string) {
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}
