// src\track\dto\creat-track.dto.ts
export class CreateTrackDto {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
