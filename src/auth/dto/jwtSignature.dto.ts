import { IsNumber, IsString } from 'class-validator';
import { RolesEnum } from '../../user/enum/roles.enum';

export class JwtSignatureDTO {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  role?: RolesEnum;
}
