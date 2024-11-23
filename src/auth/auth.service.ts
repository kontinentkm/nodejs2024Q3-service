// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common'; // Импортируем UnauthorizedException

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  // Регистрация нового пользователя
  async signup(login: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser({ login, password: hashedPassword });
  }

  // Авторизация пользователя
  async login(login: string, password: string): Promise<any> {
    const user = await this.userService.getUserByLogin(login);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  // Генерация Access Token
  private generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.id, login: user.login },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }, // Время жизни токена
    );
  }

  // Генерация Refresh Token
  private generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.id, login: user.login },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // Время жизни Refresh Token
    );
  }

  // Обновление Access и Refresh Token
  async refreshTokens(refreshToken: string): Promise<any> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await this.userService.getUserById(
        (decoded as JwtPayload).userId,
      );
      if (!user) {
        throw new Error('User not found');
      }
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Проверка и получение пользователя по токену
  async loginCheck(token: string) {
    try {
      // Декодируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Проверяем, что декодированный результат — это объект типа JwtPayload
      if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
        // Получаем пользователя по userId
        const user = await this.userService.getUserById(
          (decoded as JwtPayload).userId,
        );
        return user; // Возвращаем пользователя
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
