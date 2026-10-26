var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { UsersRepo } from '../../common/repository/user.repo.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { userProvider, userRoles, userTokenEnum, } from '../../common/enum/user.base.enum.js';
import { ClientProxy } from '@nestjs/microservices';
import { messageEventsEnum } from '../../common/enum/messageEvents.enum.js';
import { generateOTP } from './utils/generateOTP.js';
import { emailKeyEnum } from '../../common/enum/emailSubject.enum.js';
import { tokenService } from '../../common/services/jwt/tokenService.js';
import { ConfigService } from '@nestjs/config';
import redisService from '../../common/services/redis/redis.service.js';
import { cacheKeyEnum } from '../../common/enum/cacheKey.enum.js';
import { revokeTokensRepo } from '../../common/repository/revokeToken.repo.js';
let AuthService = class AuthService {
    userRepo;
    revokeTokenRepo;
    _security;
    _tokenService;
    _configService;
    _cacheService;
    _messageQueue;
    constructor(userRepo, revokeTokenRepo, _security, _tokenService, _configService, _cacheService, _messageQueue) {
        this.userRepo = userRepo;
        this.revokeTokenRepo = revokeTokenRepo;
        this._security = _security;
        this._tokenService = _tokenService;
        this._configService = _configService;
        this._cacheService = _cacheService;
        this._messageQueue = _messageQueue;
    }
    async signUp(dto) {
        const { age, email, gender, name, password, phone_number } = dto;
        const checkEmail = await this.userRepo.findOne({
            email,
        });
        const emailData = {
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
            }
            else {
                throw new ForbiddenException('email already in use');
            }
        }
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
        this._messageQueue.emit(messageEventsEnum.email, emailData);
        return {
            message: 'please confirm your email',
        };
    }
    async signIn(dto) {
        const { email, password } = dto;
        const User = await this.userRepo.findOne({ email });
        if (!User)
            throw new NotFoundException('email not found');
        if (!this._security.GlobalCompare(password, User?.password))
            throw new UnauthorizedException('please check your email or password');
        const accessToken = this._tokenService.generateToken({
            userId: User.id,
            userRole: User.role,
        }, 1000 * 60 * 60 * 8, this._configService.get('SECRET_ACCESS_TOKEN'));
        const refreshToken = this._tokenService.generateToken({
            userId: User.id,
            userRole: User.role,
        }, 1000 * 60 * 60 * 24 * 10, this._configService.get('SECRET_REFRESH_TOKEN'));
        return {
            accessToken,
            refreshToken,
        };
    }
    async validateGoogleProfile(profile) {
        const email = profile.email;
        if (!email) {
            throw new BadRequestException();
        }
        const existingEmail = await this.userRepo.findOne({
            email,
        });
        if (existingEmail) {
            if (existingEmail.provider == userProvider.google)
                return existingEmail;
            throw new ConflictException('An account with this email already exists. Sign in using your existing method and link Google securely.');
        }
        let user = this.userRepo.create({
            email,
            name: profile.displayName,
            confirm: true,
            provider: userProvider.google,
        });
        return this.userRepo.save(user);
    }
    async signInWithGoogle(user) {
        let accessToken, refreshToken;
        if (!user.email)
            throw new ConflictException();
        const existingUser = await this.userRepo.findOne({
            email: user.email,
        });
        if (!existingUser)
            throw new NotFoundException();
        accessToken = this._tokenService.generateToken({
            userId: existingUser.id,
            userRole: existingUser.role,
        }, 1000 * 60 * 60 * 8, this._configService.get('SECRET_ACCESS_TOKEN'));
        refreshToken = this._tokenService.generateToken({
            userId: existingUser.id,
            userRole: existingUser.role,
        }, 1000 * 60 * 60 * 24 * 10, this._configService.get('SECRET_REFRESH_TOKEN'));
        return { accessToken, refreshToken };
    }
    async registerGuest() {
        const guest = await this.userRepo.save({
            role: userRoles.guest,
        });
        const accessToken = this._tokenService.generateToken({
            userId: guest.id,
            userRole: guest.role,
        }, 1000 * 60 * 60 * 8, this._configService.get('SECRET_ACCESS_TOKEN'));
        const refreshToken = this._tokenService.generateToken({
            userId: guest.id,
            userRole: guest.role,
        }, 1000 * 60 * 60 * 8, this._configService.get('SECRET_REFRESH_TOKEN'));
        return { accessToken, refreshToken };
    }
    async registerGuestAsUser(guestId, dto) {
        const guest = await this.userRepo.findOne({ id: guestId });
        if (!guest)
            throw new NotFoundException('user Not Found');
        const { age, email, gender, name, password, phone_number } = dto;
        const checkEmail = await this.userRepo.findOne({
            email,
        });
        const emailData = {
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
            }
            else {
                throw new ForbiddenException('email already in use');
            }
        }
        const userInfo = {
            name,
            email,
            age,
            gender,
            password: this._security.globalHash(password),
            phone_number: this._security.Globalencrypt(phone_number),
            role: userRoles.user,
        };
        const user = await this.userRepo.update({
            id: guest.id,
        }, userInfo);
        this._messageQueue.emit(messageEventsEnum.email, emailData);
        return {
            message: 'please confirm your email',
        };
    }
    async confirmEmail(dto) {
        const { email, otp } = dto;
        const findUser = await this.userRepo.findOne({ email });
        if (!findUser)
            throw new NotFoundException('user not found');
        const cachedOtp = await this._cacheService.getKey({
            key: this._cacheService.cacheKey({
                filter: email,
                subject: cacheKeyEnum.confirmSignUp,
            }),
        });
        if (!cachedOtp)
            throw new NotFoundException('otp code has expired');
        const checkOtp = this._security.GlobalCompare(otp, cachedOtp.toString());
        if (!checkOtp)
            throw new ForbiddenException('wrong otp');
        await this.userRepo.update({ id: findUser.id }, {
            confirm: true,
        });
        return { message: 'email confirmed' };
    }
    async refreshToken(authorization) {
        const [bearer, token] = authorization.split(' ');
        const checkRevoke = await this.revokeTokenRepo.findOne({ token });
        if (checkRevoke)
            throw new UnauthorizedException('invalid token');
        let decode;
        try {
            decode = this._tokenService.verifyToken(token, this._configService.get('SECRET_REFRESH_TOKEN'));
        }
        catch {
            throw new UnauthorizedException('invalid token');
        }
        const user = await this.userRepo.findOne({ id: decode.userId });
        if (!user)
            throw new NotFoundException('user not found');
        const accessToken = this._tokenService.generateToken({
            userId: user.id,
            userRole: user.role,
        }, 1000 * 60 * 60 * 8, this._configService.get('SECRET_ACCESS_TOKEN'));
        const refreshToken = this._tokenService.generateToken({
            userId: user.id,
            userRole: user.role,
        }, 1000 * 60 * 60 * 8, this._configService.get('SECRET_REFRESH_TOKEN'));
        await this.revokeTokenRepo.save({
            expiresIn: new Date(decode.exp),
            timestamp: new Date(),
            token,
            type: userTokenEnum.refresh,
            userId: user.id,
        });
        return { accessToken, refreshToken };
    }
    async logout(user, TokenDecode, flag = undefined) {
        if (flag == 'all') {
            await this.userRepo.update({ id: user.id }, {
                credentials: new Date(),
            });
            return { message: 'logout succeed' };
        }
        else {
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
    async forgetPassword(dto) {
        const { email } = dto;
        const checkEmail = await this.userRepo.findOne({ email });
        if (!checkEmail)
            throw new NotFoundException('email not found');
        const emailDate = {
            email,
            data: generateOTP(),
            subject: emailKeyEnum.forgetPassword,
        };
        this._messageQueue.emit(messageEventsEnum.email, emailDate);
        return { message: 'an otp has sent to your email' };
    }
    async confirmOTP(dto) {
        const { email, otp } = dto;
        const findUser = await this.userRepo.findOne({ email });
        if (!findUser)
            throw new NotFoundException('user not found');
        const cachedOtp = await this._cacheService.getKey({
            key: this._cacheService.cacheKey({
                filter: email,
                subject: cacheKeyEnum.forgetPassword,
            }),
        });
        if (!this._security.GlobalCompare(otp, cachedOtp))
            throw new ForbiddenException('wrong otp');
        const accessToken = this._tokenService.generateToken({
            userId: findUser.id,
            userRole: findUser.role,
        }, 1000 * 60 * 60 * 8, this._configService.get('SECRET_ACCESS_TOKEN'));
        const refreshToken = this._tokenService.generateToken({
            userId: findUser.id,
            userRole: findUser.role,
        }, 1000 * 60 * 60 * 24 * 10, this._configService.get('SECRET_REFRESH_TOKEN'));
        return {
            accessToken,
            refreshToken,
        };
    }
    async resendOTP(dto) {
        const { email } = dto;
        const checkEmail = await this.userRepo.findOne({ email });
        if (!checkEmail)
            throw new NotFoundException('email not found');
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
        }
        else {
            if (checkAttempts > 3) {
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
                throw new ForbiddenException('you have been blocked for 15 minutes');
            }
            else {
                const [ttl] = await Promise.all([
                    this._cacheService.getKeyTtl(this._cacheService.cacheKey({
                        filter: email,
                        subject: cacheKeyEnum.attempts,
                    })),
                    this._cacheService.incrKey(this._cacheService.cacheKey({
                        filter: email,
                        subject: cacheKeyEnum.attempts,
                    })),
                ]);
                throw new ForbiddenException(`you have been blocked for please wait for ${ttl} seconds`);
            }
        }
        this._messageQueue.emit(messageEventsEnum.email, emailDate);
        return { message: 'an otp has sent to your email' };
    }
    async resetPassword(user, dto) {
        const { password } = dto;
        if (this._security.GlobalCompare(password, user.password))
            throw new ConflictException('new password should not match old one');
        await this.userRepo.update({ id: user.id }, {
            password: this._security.globalHash(password),
        });
        return { message: 'password updated' };
    }
};
AuthService = __decorate([
    Injectable(),
    __param(6, Inject('NOTIFICATION_SERVICE')),
    __metadata("design:paramtypes", [UsersRepo,
        revokeTokensRepo,
        securityServices,
        tokenService,
        ConfigService,
        redisService,
        ClientProxy])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map