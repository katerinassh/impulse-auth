import { IsNumber, IsString } from 'class-validator';

export class RefreshSessionDto {
  @IsNumber()
  userId: number;

  @IsString()
  refreshToken?: string;

  @IsString()
  fingerprint: string;

  @IsString()
  ip: string;
}
