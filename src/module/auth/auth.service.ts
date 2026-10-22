import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepo } from '../../common/repository/user.repo.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { userProvider, userRoles } from '../../common/enum/user.base.enum.js';
import { ClientProxy } from '@nestjs/microservices';
import { messageEventsEnum } from '../../common/enum/messageEvents.enum.js';
import { emailEventData } from '../../common/types/emailEventData.type.js';
import { generateOTP } from './utils/generateOTP.js';
import { emailKeyEnum } from '../../common/enum/emailSubject.enum.js';
import { signInDTO } from './validation/signin.dto.js';
import { tokenService } from '../../common/services/jwt/tokenService.js';
import { ConfigService } from '@nestjs/config';
import { googleProfileType } from '../../common/types/googleStrategy.type.js';
import { emit } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepo,
    private readonly _security: securityServices,
    private readonly _tokenService: tokenService,
    private readonly _configService: ConfigService,
    @Inject('NOTIFICATION_SERVICE') private readonly _messageQueue: ClientProxy,
  ) {}

  async signUp(dto: signUpDTO) {
    const { age, email, gender, name, password, phone_number } = dto;
    // check email
    const checkEmail = await this.userRepo.findOne({
      email,
    });
    const emailData: emailEventData = {
      email,
      data: generateOTP(),
      subject: emailKeyEnum.confirmSignUp,
    };
    if (checkEmail) {
      if (!checkEmail.confirm) {
        this._messageQueue.emit(messageEventsEnum.email, emailData);
        return {
          message: 'otp has sent to your email',
        };
      } else {
        throw new ForbiddenException('email already in use');
      }
    }
    // create the user
    const userInfo = {
      name,
      email,
      age,
      gender,
      password: this._security.globalHash(password),
      phone_number: this._security.Globalencrypt(phone_number),
      role: userRoles.user,
    };

    const user = await this.userRepo.save(userInfo);
    // publish event to broker to sending email

    this._messageQueue.emit(messageEventsEnum.email, emailData);
    // sending response

    return {
      message: 'please confirm your email',
    };
  }
  async signIn(dto: signInDTO) {
    const { email, password } = dto;
    const User = await this.userRepo.findOne({ email });
    if (!User) throw new NotFoundException('email not found');
    if (this._security.GlobalCompare(password, User?.password))
      throw new UnauthorizedException('please check your email or password');
    const accessToken = this._tokenService.generateToken(
      {
        userId: User.id,
        userRole: User.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get<string>('USER_ACCESS_SECRET')!,
    );
    const refreshToken = this._tokenService.generateToken(
      {
        userId: User.id,
        userRole: User.role,
      },
      1000 * 60 * 60 * 24 * 10,
      this._configService.get<string>('USER_REFRESH_SECRET')!,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
  async validateGoogleProfile(profile: googleProfileType) {
    const email = profile.emails?.[0]?.value;

    if (!email || profile.emails?.[0]?.verified !== true) {
      throw new ConflictException('A verified Google email is required');
    }

    const existingEmail = await this.userRepo.findOne({
      email,
    });

    if (existingEmail) {
      if (existingEmail.provider == userProvider.google) return existingEmail;
      throw new ConflictException(
        'An account with this email already exists. Sign in using your existing method and link Google securely.',
      );
    }

    let user = this.userRepo.create({
      email,
      name: profile.displayName,
      confirm: true,
      provider: userProvider.google,
    });

    return this.userRepo.save(user);
  }
  async signInWithGoogle(user: googleProfileType) {
    let accessToken, refreshToken;
    if (!user.emails || !user.emails[0].value) throw new ConflictException();
    const existingUser = await this.userRepo.findOne({
      email: user.emails[0].value,
    });
    if (!existingUser) throw new NotFoundException();

    accessToken = this._tokenService.generateToken(
      {
        userId: existingUser.id,
        userRole: existingUser.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get('USER_ACCESS_SECRET')!,
    );

    refreshToken = this._tokenService.generateToken(
      {
        userId: existingUser.id,
        userRole: existingUser.role,
      },
      1000 * 60 * 60 * 24 * 10,
      this._configService.get<string>('USER_REFRESH_SECRET')!,
    );

    return { accessToken, refreshToken };
  }
  async registerGuest() {}
  async registerGuestAsUser() {}
  async confirmEmail() {}
  async refreshToken() {}
  async logout() {}
  async forgetPassword() {}
  async confirmOTP() {}
  async resendOTP() {}
  async resetPassword() {}
}
