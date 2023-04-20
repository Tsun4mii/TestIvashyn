import { IsNotEmpty, IsString } from 'class-validator';

export class GenPdfDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}
