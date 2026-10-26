import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { NotFoundError, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { tokenService } from '../../services/jwt/tokenService.js';
import { UsersRepo } from '../../repository/user.repo.js';
import { Reflector } from '@nestjs/core';
import { ACCESS_TOKEN_TYPE } from './authentication.guard.js';
import { userTokenEnum } from '../../enum/user.base.enum.js';

@Injectable()
export class tokenVerificationGuard implements CanActivate {
  constructor(
    private readonly _tokenService: tokenService,
    private readonly _config: ConfigService,
    private readonly _userRepo: UsersRepo,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    try {
      const access_type = this.reflector.get(
        ACCESS_TOKEN_TYPE,
        context.getHandler,
      ) as string;

      const secret_type =
        access_type == userTokenEnum.access
          ? this._config.get<string>('SECRET_ACCESS_TOKEN')!
          : this._config.get<string>('SECRET_REFRESH_TOKEN')!;
      const decoded = this._tokenService.verifyToken(
        request.decode!.token,
        secret_type,
      );

      request.decode = { ...decoded, token: request.decode!.token };
      // grpc call to identity service to get the user information

      const user = await this._userRepo.findOne({ id: decoded.userId });
      if (!user) throw new NotFoundException('user not found');
      if (user.credentials > new Date(decoded.iat))
        throw new UnauthorizedException('token expired please login again');

      request.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
