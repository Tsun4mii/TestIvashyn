import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDTO {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
