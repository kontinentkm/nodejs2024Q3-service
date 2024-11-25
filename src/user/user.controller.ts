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
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { LoggingService } from '../logging/logging/logging.service';
import { isUUID } from 'class-validator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  async getAllUsers() {
    this.logger.log('Fetching all users');
    try {
      const users = await this.userService.getAllUsers();
      this.logger.log('Successfully fetched all users');
      return users;
    } catch (error) {
      this.logger.error('Error fetching all users', error.stack);
      throw error;
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    this.logger.log(`Fetching user by ID: ${id}`);
    if (!isUUID(id)) {
      this.logger.warn(`Invalid ID format: ${id}`);
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        this.logger.warn(`User not found: ${id}`);
        throw new NotFoundException('User not found');
      }
      this.logger.log(`Successfully fetched user: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user: ${id}`, error.stack);
      throw error;
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating a new user');
    try {
      const user = await this.userService.createUser(createUserDto);
      this.logger.log('Successfully created a new user');
      return user;
    } catch (error) {
      this.logger.error('Error creating a new user', error.stack);
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.logger.log(`Updating password for user ID: ${id}`);
    if (!isUUID(id)) {
      this.logger.warn(`Invalid ID format: ${id}`);
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const user = await this.userService.updatePassword(id, updatePasswordDto);
      if (!user) {
        this.logger.warn(`User not found: ${id}`);
        throw new NotFoundException('User not found');
      }
      this.logger.log(`Successfully updated password for user: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error updating password for user: ${id}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204) // Устанавливаем статус код 204 для успешного удаления
  async delete(@Param('id') id: string) {
    this.logger.log(`Deleting user by ID: ${id}`);
    if (!isUUID(id)) {
      this.logger.warn(`Invalid ID format: ${id}`);
      throw new BadRequestException('Invalid ID format');
    }

    try {
      await this.userService.deleteUser(id);
      this.logger.log(`Successfully deleted user: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting user: ${id}`, error.stack);
      throw error;
    }
  }
}
