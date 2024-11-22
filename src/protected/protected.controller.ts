// src/protected/protected.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service'; // Убедитесь, что у вас есть AuthService для обработки токенов
import { UserService } from '../user/user.service';

@Controller('protected')
@UseGuards(AuthGuard) // Применяем Guard ко всем маршрутам в этом контроллере
export class ProtectedController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, // Добавляем AuthService
  ) {}

  @Get('profile')
  async getProfile(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка Authorization
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    // Проверяем токен и получаем данные о пользователе
    const user = await this.authService.loginCheck(token);
    return user; // Возвращаем пользователя
  }

  @Post('update')
  async updateUser(@Req() req, @Body() updateData) {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка Authorization
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    // Проверяем токен и получаем данные о пользователе
    const user = await this.authService.loginCheck(token);

    // Обновляем данные пользователя
    return this.userService.updateUser(user.id, updateData);
  }
}
