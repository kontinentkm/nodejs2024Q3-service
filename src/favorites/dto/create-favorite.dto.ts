// src/favorites/dto/create-favorite.dto.ts
import { IsString, IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID()
  id: string; // UUID v4

  @IsString()
  name: string;

  year?: number; // Только для альбомов
  artistId?: string; // Для альбомов и треков
  duration?: number; // Только для треков
  grammy?: boolean; // Только для артистов
}
