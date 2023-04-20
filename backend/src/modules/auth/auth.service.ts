import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCreateDTO } from '../user/dto/user.create.dto';
import { UserService } from '../user/user.service';
import { AuthLoginDTO } from './dto/auth.login.dto';
import { Tokens } from './types/tokens.type';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async register(user: UserCreateDTO): Promise<Tokens> {
    const newUser = await this.userService.create(user);
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.userService.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async login(user: AuthLoginDTO): Promise<Tokens> {
    const userExists = await this.userService.findByEmail(user.email);
    if (!userExists) {
      throw new ForbiddenException('Wrong Email');
    }
    const passwordsMatch = await bcrypt.compare(
      user.password,
      userExists.password,
    );
    if (!passwordsMatch) {
      throw new ForbiddenException('Wrong Password');
    }
    const tokens = await this.getTokens(userExists.id, userExists.email);
    await this.userService.updateRtHash(userExists.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    return await this.userService.updateOnLogout(userId);
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: 60 * 15,
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
