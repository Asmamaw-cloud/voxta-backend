// src/modules/users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // ✅ Protect ALL routes with JWT
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create user - only ADMIN
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  // Get all users - only ADMIN
  // @UseGuards(RolesGuard)
  // @Roles('ADMIN', 'USER')
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // Get user by ID - ADMIN or the user themselves
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get(':id')
  getUserById(@Param('id') id: string, @Req() req: any) {
    // Optional: Only allow user to fetch their own data if not ADMIN
    if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
      throw new UnauthorizedException('Forbidden');
    }
    return this.usersService.getUserById(id);
  }

  // Update user - ADMIN or the user themselves
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: any) {
    if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
      throw new UnauthorizedException('Forbidden');
    }
    return this.usersService.updateUser(id, dto);
  }

  // Delete user - only ADMIN
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  // Get logged-in user's profile
  @Get('me')
  getMe(@Req() req: any) {
    return req.user; // populated by JwtStrategy
  }
}
