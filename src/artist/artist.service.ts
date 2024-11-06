import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistService {
  private artists = [];

  getAllArtists() {
    return this.artists;
  }

  getArtistById(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  createArtist(createArtistDto: CreateArtistDto) {
    const newArtist = { id: 'some-uuid', ...createArtistDto };
    this.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, updateArtistDto: CreateArtistDto) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (artist) {
      Object.assign(artist, updateArtistDto);
      return artist;
    }
    return null;
  }

  deleteArtist(id: string) {
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
