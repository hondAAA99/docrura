import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { passportClientEnum } from '../enum/passport.enum.js';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(passportClientEnum.google) {}
