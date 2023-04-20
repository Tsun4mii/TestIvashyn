import { Injectable } from '@nestjs/common';
import { UserCreateDTO } from './dto/user.create.dto';
import { UserMapper } from './mapper/user.mapper';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { UserFindDTO } from './dto/user.find.dto';
import { User } from '@prisma/client';
import { UserPutDTO } from './dto/user.put.dto';
import { UserPatchDTO } from './dto/user.patch.dto';
import { PDFDocument, PDFImage } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { UserNotFoundError } from './errors/service/user.UserNotFound.service.error';
import { UserErrorMessages } from './errors/messages/user.error.messages';
import { UserWrongFormatError } from './errors/service/user.WrongFormat.service.error';
import { UserExistError } from './errors/service/user.UserExist.service.error';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async create(user: UserCreateDTO): Promise<User> {
    const userExists = await this.userRepository.findByEmail(user.email);
    if (userExists) {
      throw new UserExistError(UserErrorMessages.USER_EXIST);
    }
    const passwordHash = await bcrypt.hash(user.password, 10);
    const mappedData = this.userMapper.fromCreateDtoToCreateUserInput(
      user,
      passwordHash,
    );
    return await this.userRepository.create(mappedData);
  }

  async findAll(params: UserFindDTO) {
    const mappedParams = this.userMapper.fromFindDtoToFindManyArgs(params);
    const users = await this.userRepository.findAll(mappedParams);
    const resultArray = this.userMapper.removeBuffer(users);
    return resultArray;
  }

  async delete(userId: string): Promise<User> {
    return await this.userRepository.delete(userId);
  }

  async updatePut(userId: string, data: UserPutDTO): Promise<User> {
    const mappedData = this.userMapper.fromPutDtoToUserUpdateInput(data);
    return await this.userRepository.update(userId, mappedData);
  }

  async updatePatch(userId: string, data: UserPatchDTO): Promise<User> {
    const mappedData = this.userMapper.fromPatchDtoToUpdateInput(data);
    return await this.userRepository.update(userId, mappedData);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  async updateRtHash(userId: string, refresh_token: string) {
    return await this.userRepository.updateRtHash(userId, refresh_token);
  }

  async updateOnLogout(userId: string) {
    return await this.userRepository.updateOnLogout(userId);
  }

  async genPdf(email: string) {
    const userExists = await this.findByEmail(email);
    if (!userExists) {
      throw new UserNotFoundError(UserErrorMessages.USER_NOT_FOUD);
    }
    if (userExists.image === null) {
      throw new UserWrongFormatError(UserErrorMessages.WRONG_PHOTO_FORMAT);
    }
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(userExists.firstName + ' ' + userExists.lastName);
    const imageBytes = readFileSync(join(process.cwd(), userExists.image));
    let userImg: PDFImage;
    if (userExists.image.includes('.jpg')) {
      userImg = await pdfDoc.embedJpg(imageBytes);
    } else if (userExists.image.includes('.png')) {
      userImg = await pdfDoc.embedPng(imageBytes);
    } else {
      throw new UserWrongFormatError(UserErrorMessages.WRONG_PHOTO_FORMAT);
    }
    page.drawImage(userImg, { x: 50, y: 250, width: 250, height: 150 });
    const pdfBytes = await pdfDoc.save();
    writeFileSync('./temp.pdf', pdfBytes);
    await this.userRepository.update(userExists.id, {
      pdf: Buffer.from(pdfBytes),
    });
    return { result: true };
  }
}
