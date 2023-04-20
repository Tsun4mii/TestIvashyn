import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/at.strategy';
import { RefreshTokenStrategy } from './strategies/rt.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UserService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
