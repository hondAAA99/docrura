import { User } from '../../database/user.model.js';
import { googleProfileType } from './googleStrategy.type.js';
import { userPayload } from './userPayload.type.js';

declare module 'express' {
  interface Request {
    user?: User | googleProfileType;
    decode?: userPayload;
  }
}
