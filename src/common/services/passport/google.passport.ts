import { ConflictException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../../module/auth/auth.service.js';
import { passportClientEnum } from '../../enum/passport.enum.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  passportClientEnum.google,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly _authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return await this._authService.validateGoogleProfile({
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.map((email) => email.value)[0]!,
      photo: profile.photos?.map((photo) => photo.value)[0]!,
    });
  }
}
