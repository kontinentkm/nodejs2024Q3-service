// src/user/dto/create-user.dto.ts
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  login: string;

  @Exclude()
  password: string;
}
