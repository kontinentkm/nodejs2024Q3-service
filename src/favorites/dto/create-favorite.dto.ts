// src/favorites/dto/create-favorite.dto.ts
import { IsString, IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID()
  id: string; // UUID v4

  @IsString()
  name: string;
}
