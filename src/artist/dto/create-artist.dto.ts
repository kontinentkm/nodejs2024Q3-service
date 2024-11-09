import { IsString, IsBoolean, IsUUID } from 'class-validator';

export class CreateArtistDto {
  @IsUUID()
  id: string; // UUID v4

  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
