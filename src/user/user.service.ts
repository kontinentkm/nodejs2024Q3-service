import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UserService {
  private users = [];

  findAll() {
    return this.users;
  }

  findById(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const newUser = { ...createUserDto, id: generateUUID() };
    this.users.push(newUser);
    return newUser;
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.findById(id);
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }
    user.password = updatePasswordDto.newPassword;
    return user;
  }

  remove(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }
}

function generateUUID() {
  // Простая генерация UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
