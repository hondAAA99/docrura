import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async signUp() {}
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
