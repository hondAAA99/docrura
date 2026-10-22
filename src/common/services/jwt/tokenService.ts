import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { uuidv7 as uuid } from 'uuidv7';
import { userRoles } from '../../enum/user.base.enum.js';
import { userPayload } from '../../types/userPayload.type.js';

@Injectable()
export class tokenService {
  constructor(
    private readonly _jwt: JwtService,
    private readonly _config: ConfigService,
  ) {}

  generateToken(
    payload: { userId: string; userRole: string },
    expiresIn: number,
    secret: string,
  ) {
    return this._jwt.sign(
      { ...payload, id: uuid() },
      {
        secret,
        expiresIn,
      },
    );
  }

  verifyToken(token: string, secret: string): userPayload {
    return this._jwt.verify(token, { secret });
  }

  getAccessAndRefreshSecrets(role: userRoles, _config: ConfigService) {
    let accessSecret;
    let refreshSecret;
    if (role == userRoles.user) {
      refreshSecret = _config.get<string>('SECRET_USER_REFRESH_TOKEN');
      accessSecret = _config.get<string>('SECRET_USER_ACCESS_TOKEN');
    } else {
      refreshSecret = _config.get<string>('SECRET_GUEST_REFRESH_TOKEN');
      accessSecret = _config.get<string>('SECRET_GUEST_ACCESS_TOKEN');
    }

    return { accessSecret, refreshSecret };
  }
}
