import { v4 as uuid } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { RefreshSessionDto } from './dto/refreshSession.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshSession } from './refresh-session.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtSignatureDTO } from './dto/jwtSignature.dto';
import { UserService } from 'src/user/user.service';
import { ValidateRefreshSessionDto } from './dto/validateRefreshSession.dto';

@Injectable()
export class RefreshSessionService extends TypeOrmCrudService<RefreshSession> {
  constructor(
    @InjectRepository(RefreshSession)
    private repository: Repository<RefreshSession>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super(repository);
  }

  async createRefreshSessionAndGetRefreshToken(
    refreshSessionDto: RefreshSessionDto,
  ): Promise<string> {
    if (!(await this.isValidNumberOfSessions(refreshSessionDto.userId))) {
      await this.removeAllUserSesssion(refreshSessionDto.userId);
    }
    const refreshToken = uuid();

    await this.repository.insert({
      ...refreshSessionDto,
      refreshToken,
      expiresIn: addDays(
        new Date(),
        parseInt(process.env.JWT_SESSION_LIFETIME_DAYS),
      )
        .getMilliseconds()
        .toString(),
    });

    return refreshToken;
  }

  async isValidNumberOfSessions(userId: number): Promise<boolean> {
    const count = await this.repository.count({ where: { userId } });
    return count < parseInt(process.env.MAX_REFRESH_SESSIONS_COUNT);
  }

  async removeAllUserSesssion(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  async invalidateRefreshSession(refreshToken: string): Promise<void> {
    await this.repository.delete({ refreshToken });
  }

  async validateRefreshSession(refreshSession: ValidateRefreshSessionDto) {
    const storeRefreshSession = await this.repository.findOne({
      where: { refreshToken: refreshSession.refreshToken },
    });

    if (
      !storeRefreshSession ||
      refreshSession.ip !== storeRefreshSession.ip ||
      refreshSession.fingerprint !== storeRefreshSession.fingerprint
    ) {
      throw new BadRequestException('Invalid refresh session');
    }
    return;
  }

  async getAccessToken(
    refreshSession: ValidateRefreshSessionDto,
  ): Promise<string> {
    await this.validateRefreshSession(refreshSession);

    const userRefreshSession = await this.repository.findOne({
      where: { refreshToken: refreshSession.refreshToken },
    });

    const userJWTSignature = await this.getUserJWTSignature(
      userRefreshSession.userId,
    );
    return this.jwtService.signAsync(userJWTSignature, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_LIFETIME,
    });
  }

  async getUserJWTSignature(userId: number): Promise<JwtSignatureDTO> {
    const user = await this.userService.getById(userId);

    return {
      id: userId,
      email: user.email,
      role: user.role,
    };
  }
}
