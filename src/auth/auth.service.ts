import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Request } from 'express-serve-static-core';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateCustomerDTO } from '../user/dto/createCustomer.dto';
import { SignInDTO } from './dto/signIn.dto';
import { User } from '../user/user.entity';
import { CompleteSignUpDTO } from './dto/completeSignUp.dto';
import { DecodedToken } from './types/decodedToken.type';
import { MailService } from 'src/mail/mail.service';
import { RefreshSessionService } from './refresh-session.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshSessionService: RefreshSessionService,
    private mailService: MailService,
  ) {}

  static async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  }

  async extractMetadataFromRequest(req: Request): Promise<{
    fingerprint: string;
    ip: string;
    refreshToken: string;
  }> {
    const fingerprint = req.headers['x-fp'] as string;
    const ip = req.ip;

    if (!fingerprint) {
      throw new BadRequestException('Browser fingerprint is not provided');
    }

    const refreshToken = req.cookies['refresh_token'];

    return {
      fingerprint,
      ip,
      refreshToken,
    };
  }

  async customerSignUp(
    createCustomerDto: CreateCustomerDTO,
    fingerprint: string,
    ip: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.userService.getByEmail(createCustomerDto.email);
    if (user)
      throw new BadRequestException('User with such email already exists');

    const hashedPassword = await AuthService.hashData(
      createCustomerDto.password,
    );
    const customer = await this.userService.createCustomer({
      ...createCustomerDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(customer, fingerprint, ip);

    return { ...tokens, user: customer };
  }

  async signIn(
    { email, password }: SignInDTO,
    fingerprint: string,
    ip: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.validateUser({ email, password });

    const tokens = await this.getTokens(user, fingerprint, ip);
    return { ...tokens, user };
  }

  async inviteAdmin(email: string) {
    const user = await this.userService.getByEmail(email);
    if (user)
      throw new BadRequestException(`User already registrated as ${user.role}`);

    const newUser = await this.userService.createBlankAdmin(email);

    const userJWTSignature =
      await this.refreshSessionService.getUserJWTSignature(newUser.id);
    const accessToken = await this.jwtService.signAsync(userJWTSignature, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_LIFETIME,
    });

    try {
      await this.mailService.sendAdminInvite(newUser, accessToken);
    } catch (err) {
      await this.userService.delete(newUser.id);
      throw new NotAcceptableException(err);
    }
  }

  async completeSignUp(
    token: string,
    completeRegistrationDto: CompleteSignUpDTO,
  ): Promise<User> {
    const decoded = this.jwtService.decode(token) as DecodedToken;
    if (Date.now() >= decoded.exp * 1000) {
      throw new ForbiddenException('Link has been expired');
    }

    const hashedPassword = await AuthService.hashData(
      completeRegistrationDto.password,
    );
    return this.userService.updateUser(decoded.id, {
      ...completeRegistrationDto,
      password: hashedPassword,
    });
  }

  async getUserDataFromSocials(
    email: string,
    req: Request,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { fingerprint, ip } = await this.extractMetadataFromRequest(req);

    const user = await this.userService.getByEmail(email);
    if (!user) throw new BadRequestException(`User not found`);

    const tokens = await this.getTokens(user, fingerprint, ip);
    return { ...tokens, user };
  }

  public async validateUser({ email, password }: SignInDTO): Promise<User> {
    const user = await this.userService.getByEmail(email, true);

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new BadRequestException('Passwords mismatch');
    }
    return user;
  }

  public async getTokens(
    user: User,
    fingerprint: string,
    ip: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken =
      await this.refreshSessionService.createRefreshSessionAndGetRefreshToken({
        userId: user.id,
        fingerprint,
        ip,
      });
    const accessToken = await this.refreshSessionService.getAccessToken({
      refreshToken,
      fingerprint,
      ip,
    });

    return { accessToken, refreshToken };
  }
}
