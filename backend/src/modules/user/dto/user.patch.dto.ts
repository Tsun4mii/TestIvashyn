import { IsOptional, IsString } from 'class-validator';

export class UserPatchDTO {
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  image?: string;
  pdf?;
}
