import { IsString } from 'class-validator';

export class ValidateRefreshSessionDto {
  @IsString()
  refreshToken: string;

  @IsString()
  fingerprint: string;

  @IsString()
  ip: string;
}
