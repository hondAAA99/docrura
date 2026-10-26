import {
  BadRequestException,
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
import {
  userProvider,
  userRoles,
  userTokenEnum,
} from '../../common/enum/user.base.enum.js';
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
import { registerGuestAsUserDTO } from './validation/registerGuestAsUser.dto.js';
import { confirmEmailDTO } from './validation/confirmEmail.dto.js';
import redisService from '../../common/services/redis/redis.service.js';
import { cacheKeyEnum } from '../../common/enum/cacheKey.enum.js';
import { revokeTokensRepo } from '../../common/repository/revokeToken.repo.js';
import { User } from '../../database/user.model.js';
import { logoutDTO } from './validation/logout.dto.js';
import { userPayload } from '../../common/types/userPayload.type.js';
import { forgetPasswordDTO } from './validation/forgetPassword.dto.js';
import { resetPasswordDTO } from './validation/resetPassword.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepo,
    private readonly revokeTokenRepo: revokeTokensRepo,
    private readonly _security: securityServices,
    private readonly _tokenService: tokenService,
    private readonly _configService: ConfigService,
    private readonly _cacheService: redisService,
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
    if (!this._security.GlobalCompare(password, User?.password))
      throw new UnauthorizedException('please check your email or password');
    const accessToken = this._tokenService.generateToken(
      {
        userId: User.id,
        userRole: User.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get<string>('SECRET_ACCESS_TOKEN')!,
    );
    const refreshToken = this._tokenService.generateToken(
      {
        userId: User.id,
        userRole: User.role,
      },
      1000 * 60 * 60 * 24 * 10,
      this._configService.get<string>('SECRET_REFRESH_TOKEN')!,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
  async validateGoogleProfile(profile: googleProfileType) {
    const email = profile.email;

    if (!email) {
      throw new BadRequestException();
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

    if (!user.email) throw new ConflictException();
    const existingUser = await this.userRepo.findOne({
      email: user.email,
    });
    if (!existingUser) throw new NotFoundException();

    accessToken = this._tokenService.generateToken(
      {
        userId: existingUser.id,
        userRole: existingUser.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get('SECRET_ACCESS_TOKEN')!,
    );

    refreshToken = this._tokenService.generateToken(
      {
        userId: existingUser.id,
        userRole: existingUser.role,
      },
      1000 * 60 * 60 * 24 * 10,
      this._configService.get<string>('SECRET_REFRESH_TOKEN')!,
    );

    return { accessToken, refreshToken };
  }
  async registerGuest() {
    const guest = await this.userRepo.save({
      role: userRoles.guest,
    });

    const accessToken = this._tokenService.generateToken(
      {
        userId: guest.id,
        userRole: guest.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get<string>('SECRET_ACCESS_TOKEN')!,
    );
    const refreshToken = this._tokenService.generateToken(
      {
        userId: guest.id,
        userRole: guest.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get<string>('SECRET_REFRESH_TOKEN')!,
    );

    return { accessToken, refreshToken };
  }
  async registerGuestAsUser(guestId: string, dto: registerGuestAsUserDTO) {
    const guest = await this.userRepo.findOne({ id: guestId });
    if (!guest) throw new NotFoundException('user Not Found');
    const { age, email, gender, name, password, phone_number } = dto;
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

    const user = await this.userRepo.update(
      {
        id: guest.id,
      },
      userInfo,
    );
    // publish event to broker to sending email

    this._messageQueue.emit(messageEventsEnum.email, emailData);
    // sending response

    return {
      message: 'please confirm your email',
    };
  }
  async confirmEmail(dto: confirmEmailDTO) {
    const { email, otp } = dto;
    const findUser = await this.userRepo.findOne({ email });
    if (!findUser) throw new NotFoundException('user not found');
    const cachedOtp = await this._cacheService.getKey({
      key: this._cacheService.cacheKey({
        filter: email,
        subject: cacheKeyEnum.confirmSignUp,
      }),
    });
    if (!cachedOtp) throw new NotFoundException('otp code has expired');
    const checkOtp = this._security.GlobalCompare(otp, cachedOtp.toString());
    if (!checkOtp) throw new ForbiddenException('wrong otp');
    // if (otp != cachedOtp) throw new ForbiddenException('wrong otp');

    await this.userRepo.update(
      { id: findUser.id },
      {
        confirm: true,
      },
    );

    return { message: 'email confirmed' };
  }
  async refreshToken(authorization: string) {
    const [bearer, token] = authorization.split(' ');
    const checkRevoke = await this.revokeTokenRepo.findOne({ token });
    if (checkRevoke) throw new UnauthorizedException('invalid token');
    let decode: userPayload;
    try {
      decode = this._tokenService.verifyToken(
        token,
        this._configService.get<string>('SECRET_REFRESH_TOKEN')!,
      );
    } catch {
      throw new UnauthorizedException('invalid token');
    }

    const user = await this.userRepo.findOne({ id: decode.userId });
    if (!user) throw new NotFoundException('user not found');

    const accessToken = this._tokenService.generateToken(
      {
        userId: user.id,
        userRole: user.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get<string>('SECRET_ACCESS_TOKEN')!,
    );
    const refreshToken = this._tokenService.generateToken(
      {
        userId: user.id,
        userRole: user.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get<string>('SECRET_REFRESH_TOKEN')!,
    );

    // revoke the token
    await this.revokeTokenRepo.save({
      expiresIn: new Date(decode.exp),
      timestamp: new Date(),
      token,
      type: userTokenEnum.refresh,
      userId: user.id,
    });

    return { accessToken, refreshToken };
  }
  async logout(
    user: User,
    TokenDecode: userPayload,
    flag: string | undefined = undefined,
  ) {
    if (flag == 'all') {
      await this.userRepo.update(
        { id: user.id },
        {
          credentials: new Date(),
        },
      );
      return { message: 'logout succeed' };
    } else {
      await this.revokeTokenRepo.save({
        expiresIn: new Date(TokenDecode.exp),
        timestamp: new Date(),
        token: TokenDecode.token,
        type: userTokenEnum.refresh,
        userId: user.id,
      });
      return { message: 'logout succeed' };
    }
  }
  async forgetPassword(dto: forgetPasswordDTO) {
    const { email } = dto;
    const checkEmail = await this.userRepo.findOne({ email });
    if (!checkEmail) throw new NotFoundException('email not found');
    const emailDate = {
      email,
      data: generateOTP(),
      subject: emailKeyEnum.forgetPassword,
    };
    this._messageQueue.emit(messageEventsEnum.email, emailDate);

    return { message: 'an otp has sent to your email' };
  }
  async confirmOTP(dto: confirmEmailDTO) {
    const { email, otp } = dto;
    const findUser = await this.userRepo.findOne({ email });
    if (!findUser) throw new NotFoundException('user not found');
    const cachedOtp = await this._cacheService.getKey({
      key: this._cacheService.cacheKey({
        filter: email,
        subject: cacheKeyEnum.forgetPassword,
      }),
    });

    if (!this._security.GlobalCompare(otp, cachedOtp))
      throw new ForbiddenException('wrong otp');

    const accessToken = this._tokenService.generateToken(
      {
        userId: findUser.id,
        userRole: findUser.role,
      },
      1000 * 60 * 60 * 8,
      this._configService.get<string>('SECRET_ACCESS_TOKEN')!,
    );

    const refreshToken = this._tokenService.generateToken(
      {
        userId: findUser.id,
        userRole: findUser.role,
      },
      1000 * 60 * 60 * 24 * 10,
      this._configService.get<string>('SECRET_REFRESH_TOKEN')!,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
  async resendOTP(dto: forgetPasswordDTO) {
    const { email } = dto;
    const checkEmail = await this.userRepo.findOne({ email });
    if (!checkEmail) throw new NotFoundException('email not found');
    const emailDate = {
      email,
      data: generateOTP(),
      subject: emailKeyEnum.forgetPassword,
    };
    const checkBlocked = await this._cacheService.getKey({
      key: this._cacheService.cacheKey({
        filter: email,
        subject: cacheKeyEnum.block,
      }),
    });
    if (checkBlocked)
      throw new ForbiddenException('you have been blocked for 15 minutes');
    const checkAttempts = await this._cacheService.getKey({
      key: this._cacheService.cacheKey({
        filter: email,
        subject: cacheKeyEnum.attempts,
      }),
    });
    if (!checkAttempts) {
      await this._cacheService.setKey({
        key: this._cacheService.cacheKey({
          filter: email,
          subject: cacheKeyEnum.attempts,
        }),
        value: '1',
        ttl: 60 * 60 * 3,
      });
    } else {
      if (checkAttempts > 3) {
        // delete attempts key
        await Promise.all([
          this._cacheService.setKey({
            key: this._cacheService.cacheKey({
              filter: email,
              subject: cacheKeyEnum.block,
            }),
            value: '1',
            ttl: 60 * 60 * 15,
          }),
          this._cacheService.deleteKey({
            key: this._cacheService.cacheKey({
              filter: email,
              subject: cacheKeyEnum.attempts,
            }),
          }),
        ]);
        // throw an error
        throw new ForbiddenException('you have been blocked for 15 minutes');
      } else {
        const [ttl] = await Promise.all([
          this._cacheService.getKeyTtl(
            this._cacheService.cacheKey({
              filter: email,
              subject: cacheKeyEnum.attempts,
            }),
          ),
          this._cacheService.incrKey(
            this._cacheService.cacheKey({
              filter: email,
              subject: cacheKeyEnum.attempts,
            }),
          ),
        ]);
        throw new ForbiddenException(
          `you have been blocked for please wait for ${ttl} seconds`,
        );
      }
    }
    this._messageQueue.emit(messageEventsEnum.email, emailDate);
    return { message: 'an otp has sent to your email' };
  }
  async resetPassword(user: User, dto: resetPasswordDTO) {
    const { password } = dto;
    if (this._security.GlobalCompare(password, user.password))
      throw new ConflictException('new password should not match old one');
    await this.userRepo.update(
      { id: user.id },
      {
        password: this._security.globalHash(password),
      },
    );

    return { message: 'password updated' };
  }
}
