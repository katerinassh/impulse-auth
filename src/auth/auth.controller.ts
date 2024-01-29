import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Res,
  Patch,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express-serve-static-core';
import { CreateCustomerDTO } from '../user/dto/createCustomer.dto';
import { SignInDTO } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../user/enum/roles.enum';
import { CompleteSignUpDTO } from './dto/completeSignUp.dto';
import { GoogleOauthGuard } from './guards/googleOauth.guard';
import { RefreshSessionService } from './refresh-session.service';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private refreshSessionService: RefreshSessionService,
  ) {}

  @Post('customer-sign-up')
  async signUp(
    @Req() req: Request,
    @Body() createCustomerDto: CreateCustomerDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; user: User }> {
    const { fingerprint, ip } = await this.service.extractMetadataFromRequest(
      req,
    );

    const { accessToken, refreshToken, user } =
      await this.service.customerSignUp(createCustomerDto, fingerprint, ip);

    response.cookie('refresh_token', refreshToken);
    return { accessToken, user };
  }

  @Post('sign-in')
  async signIn(
    @Req() req: Request,
    @Body() signInDto: SignInDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; user: User }> {
    const { fingerprint, ip } = await this.service.extractMetadataFromRequest(
      req,
    );

    const { accessToken, refreshToken, user } = await this.service.signIn(
      signInDto,
      fingerprint,
      ip,
    );

    response.cookie('refresh_token', refreshToken);
    return { accessToken, user };
  }

  @Post('sign-out')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { refreshToken } = await this.service.extractMetadataFromRequest(req);
    await this.refreshSessionService.invalidateRefreshSession(refreshToken);

    response.cookie('refresh_token', null);
  }

  @Get('get-access-token')
  async getAccessToken(@Req() req: Request): Promise<{ accessToken: string }> {
    const { fingerprint, ip, refreshToken } =
      await this.service.extractMetadataFromRequest(req);

    const accessToken = await this.refreshSessionService.getAccessToken({
      refreshToken,
      fingerprint,
      ip,
    });
    return { accessToken };
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('invite-admin')
  inviteAdmin(@Body('email') email: string): Promise<void> {
    return this.service.inviteAdmin(email);
  }

  @Patch('complete-sign-up')
  completeSignUp(
    @Query('token') token: string,
    @Body() completeRegistrationDto: CompleteSignUpDTO,
  ): Promise<User> {
    return this.service.completeSignUp(token, completeRegistrationDto);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(): Promise<boolean> {
    return true;
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(
    @Req() req,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    return this.service.getUserDataFromSocials(req.user.email, req);
  }
}
