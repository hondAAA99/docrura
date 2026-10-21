import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersRepo } from '../../common/repository/user.repo.js';
import { signUpDTO } from './validation/signUp.dto.js';
import { securityServices } from '../../common/services/security/security.service.js';
import { userRoles } from '../../common/enum/user.base.enum.js';
import { ClientProxy } from '@nestjs/microservices';
import { messageEventsEnum } from '../../common/enum/messageEvents.enum.js';
import { emailEventData } from '../../common/types/emailEventData.type.js';
import { generateOTP } from './utils/generateOTP.js';
import { emailKeyEnum } from '../../common/enum/emailSubject.enum.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepo,
    private readonly _security: securityServices,
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
  async signIn() {}
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
