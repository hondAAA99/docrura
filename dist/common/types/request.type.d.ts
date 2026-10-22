import { User } from '../../database/user.model.js';
import { googleProfileType } from './googleStrategy.type.js';
declare global {
    namespace express {
        interface Request {
            user?: User | googleProfileType;
        }
    }
}
