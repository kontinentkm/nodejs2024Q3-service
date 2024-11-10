// src/album/dto/create-album.dto.ts
import { IsString, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsUUID()
  artistId: string | null;
}
