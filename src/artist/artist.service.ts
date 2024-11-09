import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './interfaces/artist.interface';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  getAllArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  createArtist(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: 'some-uuid',
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, updateArtistDto: CreateArtistDto): Artist | null {
    const artist = this.artists.find((artist) => artist.id === id);
    if (artist) {
      Object.assign(artist, updateArtistDto);
      return artist;
    }
    return null;
  }

  deleteArtist(id: string): void {
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
