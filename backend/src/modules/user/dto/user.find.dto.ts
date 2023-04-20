import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsPositive } from 'class-validator';

export class UserFindDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  take?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  skip?: number;
  @IsOptional()
  @IsObject()
  where?: object;
  @IsOptional()
  @IsObject()
  orderBy?: object;
}
