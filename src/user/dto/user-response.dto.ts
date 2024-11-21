// src/user/dto/user-response.dto.ts
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  login: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  @Exclude() // Исключаем поле пароля из ответа
  password: string;
}
