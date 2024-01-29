import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { RefreshSessionService } from './refresh-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshSession } from './refresh-session.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshSession]),
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshSessionService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
