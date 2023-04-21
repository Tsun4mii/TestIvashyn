import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data: data });
  }

  async findAll(params: Prisma.UserFindManyArgs): Promise<User[]> {
    return await this.prisma.user.findMany(params);
  }

  async findById(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async delete(userId: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id: userId } });
  }

  async update(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({ where: { id: userId }, data: data });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email: email } });
  }

  async updateRtHash(userId: string, refresh_token: string) {
    const tokenHash = await bcrypt.hash(refresh_token, 10);
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRt: tokenHash,
      },
    });
  }

  async updateOnLogout(userId: string) {
    return await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }
}
