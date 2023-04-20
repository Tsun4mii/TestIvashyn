import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AccessTokenGuard } from 'src/common/guards/at.guard';
import { UserCreateDTO } from '../user/dto/user.create.dto';
import { UserHttpExceptionFilter } from '../user/filters/user.error.filter';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth.login.dto';
import { Tokens } from './types/tokens.type';

@UseFilters(UserHttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/local/register')
  async register(@Body() user: UserCreateDTO): Promise<Tokens> {
    return await this.authService.register(user);
  }

  @Post('/local/login')
  async login(@Body() data: AuthLoginDTO): Promise<Tokens> {
    return await this.authService.login(data);
  }

  @Post('/logout')
  @UseGuards(AccessTokenGuard)
  async logout(@GetCurrentUserId() userId: string) {
    return await this.authService.logout(userId);
  }
}
