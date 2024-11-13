import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from '../../prisma/prisma.service'; // Импорт PrismaService
import { v4 as uuidv4, validate } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany(); // Получение всех пользователей из базы данных
  }

  async getUserById(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Missing required data');
    }

    return this.prisma.user.create({
      data: {
        id: uuidv4(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = await this.getUserById(id);

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });
  }

  async deleteUser(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.getUserById(id); // Проверяем, существует ли пользователь
    await this.prisma.user.delete({ where: { id } });
  }
}
