// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ClassSerializerInterceptor } from '@nestjs/common'; // Импортируем интерсептор
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor) // Применяем интерсептор сериализации для всех маршрутов контроллера
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true })) // Добавляем валидацию
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(204) // Устанавливаем статус код 204 для успешного удаления
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
