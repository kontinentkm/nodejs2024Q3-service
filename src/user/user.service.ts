import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { Exclude } from 'class-transformer';

@Injectable()
export class UserService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    if (!validate(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  createUser(createUserDto: CreateUserDto): User {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Missing required data');
    }

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): User {
    if (!validate(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = this.getUserById(id);

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  deleteUser(id: string): void {
    if (!validate(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
    // возвращаем 204 No Content
    return;
  }
}
