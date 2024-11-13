// src/user/entities/user.entity.ts
import { Exclude } from 'class-transformer';
import { User as IUser } from '../interfaces/user.interface'; // Импорт интерфейса

export class User implements IUser {
  id: string;
  login: string;

  @Exclude() // Исключаем поле из сериализации
  password: string;

  version: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<IUser>) {
    Object.assign(this, partial);
  }
}
