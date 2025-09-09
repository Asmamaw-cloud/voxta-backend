import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../../database/prisma.module';
import { UsersController } from './users.controller';

@Module({
  controllers:[UsersController],
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],  // <-- This line is crucial
})
export class UsersModule {}
