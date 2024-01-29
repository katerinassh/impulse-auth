import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUserProfile(@Param('id') userId: string): Promise<User> {
    return this.service.getById(+userId, true);
  }
}
