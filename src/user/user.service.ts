//user/user.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { validate } from 'uuid';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany();
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

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: hashedPassword, // Сохраняем хешированный пароль
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

    // Сравниваем старый пароль с хешированным в базе
    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );

    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword, // Сохраняем новый хешированный пароль
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

  // Метод для входа пользователя
  async login(login: string, password: string) {
    // Используем findFirst, чтобы найти пользователя по login
    const user = await this.prisma.user.findFirst({
      where: {
        login: login, // Используем поле 'login' для поиска
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Сравниваем пароль с хешированным в базе
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    // Генерация токенов
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  // Метод для генерации access token
  private generateAccessToken(user: any) {
    return jwt.sign(
      { userId: user.id, login: user.login },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Время жизни токена
    );
  }

  // Метод для генерации refresh token
  private generateRefreshToken(user: any) {
    return jwt.sign(
      { userId: user.id, login: user.login },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }, // Время жизни refresh токена
    );
  }

  // В UserService добавьте метод getUserByLogin
  async getUserByLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        login: login, // Поиск по логину
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, updateData: any) {
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true }, // Пример: включение избранных
    });
  }
}
