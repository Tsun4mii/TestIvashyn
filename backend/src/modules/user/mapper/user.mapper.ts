import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserCreateDTO } from '../dto/user.create.dto';
import { UserFindDTO } from '../dto/user.find.dto';
import { UserPatchDTO } from '../dto/user.patch.dto';
import { UserPutDTO } from '../dto/user.put.dto';

@Injectable()
export class UserMapper {
  public fromCreateDtoToCreateUserInput(
    user: UserCreateDTO,
    passwordHash: string,
  ): Prisma.UserCreateInput {
    return {
      email: user.email,
      password: passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  public fromFindDtoToFindManyArgs(
    params: UserFindDTO,
  ): Prisma.UserFindManyArgs {
    return {
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
      where: params.where,
    };
  }

  public fromPutDtoToUserUpdateInput(data: UserPutDTO): Prisma.UserUpdateInput {
    return {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  }

  public fromPatchDtoToUpdateInput(data: UserPatchDTO): Prisma.UserUpdateInput {
    return {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      pdf: data.pdf,
    };
  }

  public removeBuffer(users: User[]) {
    const resultArr = users.map(({ pdf, ...keep }) => keep);
    return resultArr;
  }
}
