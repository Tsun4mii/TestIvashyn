import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AccessTokenGuard } from 'src/common/guards/at.guard';
import { storage } from './config/storage.config';
import { UserCreateDTO } from './dto/user.create.dto';
import { UserFindDTO } from './dto/user.find.dto';
import { GenPdfDTO } from './dto/user.genpdf.dto';
import { UserPatchDTO } from './dto/user.patch.dto';
import { UserPutDTO } from './dto/user.put.dto';
import { UserHttpExceptionFilter } from './filters/user.error.filter';
import { UserService } from './user.service';

@UseFilters(UserHttpExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: UserCreateDTO): Promise<User> {
    return await this.userService.create(user);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() params: UserFindDTO) {
    return await this.userService.findAll(params);
  }

  @Delete('/:id')
  async delete(
    @Param('id', new ParseUUIDPipe()) userId: string,
  ): Promise<User> {
    return await this.userService.delete(userId);
  }

  @Put('/:id')
  async updatePut(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() data: UserPutDTO,
  ): Promise<User> {
    return await this.userService.updatePut(userId, data);
  }

  @Patch('/:id')
  async updatePatch(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() data: UserPatchDTO,
  ): Promise<User> {
    return await this.userService.updatePatch(userId, data);
  }

  @Post('/uploadImage')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file', { storage: storage }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
  ) {
    const user = await this.userService.updatePatch(userId, {
      image: `/${file.path}`,
    });
    return file;
  }

  @Post('/pdf')
  async genPdf(@Body() body: GenPdfDTO) {
    return await this.userService.genPdf(body.email);
  }
}
