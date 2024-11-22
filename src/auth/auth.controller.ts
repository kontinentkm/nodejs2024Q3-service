//auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Регистрация пользователя
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const user = await this.authService.signup(login, password);
    return { message: 'User created successfully', user };
  }

  // Авторизация
  @Post('login')
  async login(@Body() loginDto: { login: string; password: string }) {
    const { login, password } = loginDto;
    const tokens = await this.authService.login(login, password);
    return tokens;
  }

  // Обновление токенов
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    const tokens = await this.authService.refreshTokens(refreshToken);
    return tokens;
  }
}
