import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { signInDTO } from './validation/signin.dto.js';
import { GoogleAuthGuard } from '../../common/guard/google.guard.js';
import type { googleProfileType } from '../../common/types/googleStrategy.type.js';
import { User } from '../../common/decorators/user.decorator.js';
import { registerGuestAsUserDTO } from './validation/registerGuestAsUser.dto.js';
import { authenticationGuard } from '../../common/guard/authentication/authentication.guard.js';
import { User as UserModel } from '../../database/user.model.js';
import { confirmEmailDTO } from './validation/confirmEmail.dto.js';
import { type Request } from 'express';
import { forgetPasswordDTO } from './validation/forgetPassword.dto.js';
import { resetPasswordDTO } from './validation/resetPassword.dto.js';
import { userTokenEnum } from '../../common/enum/user.base.enum.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body(new ValidationPipe()) dto: signUpDTO) {
    return await this.authService.signUp(dto);
  }
  @Post('/login')
  async signIn(@Body(new ValidationPipe()) dto: signInDTO) {
    return await this.authService.signIn(dto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async signInWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async signInWithGoogleCallBack(@User() user: googleProfileType) {
    return await this.authService.signInWithGoogle(user);
  }

  @Post('/guest')
  async registerGuest() {
    return this.authService.registerGuest();
  }

  @authenticationGuard(userTokenEnum.access)
  @Post('/guest/user')
  async registerGuestAsUser(
    @Body(new ValidationPipe()) dto: registerGuestAsUserDTO,
    @User() user: UserModel,
  ) {
    return this.authService.registerGuestAsUser(user.id, dto);
  }
  @Post('/signup/confirm')
  async confirmEmail(@Body(new ValidationPipe()) dto: confirmEmailDTO) {
    return this.authService.confirmEmail(dto);
  }

  @Get('/refresh')
  async refreshToken(
    @Headers('authorization')
    authorization: string,
  ) {
    if (!authorization)
      throw new BadRequestException('can not find authorization header');
    return this.authService.refreshToken(authorization);
  }

  @authenticationGuard(userTokenEnum.refresh)
  @Get('/logout')
  async logout(
    @User() user: UserModel,
    @Req() req: Request,
    @Query('flag') flag: string,
  ) {
    const TokenDecode = req.decode;
    if (!TokenDecode) throw new BadRequestException('invalid token');
    return this.authService.logout(user, TokenDecode, flag);
  }
  @Post('/forget-password')
  async forgetPassword(@Body(new ValidationPipe()) dto: forgetPasswordDTO) {
    return this.authService.forgetPassword(dto);
  }
  @Post('/confirm-otp')
  async confirmOTP(@Body(new ValidationPipe()) dto: confirmEmailDTO) {
    return this.authService.confirmOTP(dto);
  }
  @Post('/resend-otp')
  async resendOTP(@Body(new ValidationPipe()) dto: forgetPasswordDTO) {
    return this.authService.resendOTP(dto);
  }

  @authenticationGuard(userTokenEnum.access)
  @Get('/reset-password')
  async resetPassword(
    @Body(new ValidationPipe()) dto: resetPasswordDTO,
    @User() user: UserModel,
  ) {
    return this.authService.resetPassword(user, dto);
  }
}
