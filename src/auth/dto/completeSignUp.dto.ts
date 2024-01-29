import { IsString } from 'class-validator';

export class CompleteSignUpDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;
}
