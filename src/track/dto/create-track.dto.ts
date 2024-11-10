// src\track\dto\creat-track.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  artistId: string;

  @IsString()
  @IsNotEmpty()
  albumId: string;
}
