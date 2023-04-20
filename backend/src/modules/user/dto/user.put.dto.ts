import { IsNotEmpty, IsString } from 'class-validator';

export class UserPutDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
