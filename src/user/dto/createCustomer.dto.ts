import { IsEmail, IsString } from 'class-validator';

export class CreateCustomerDTO {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
