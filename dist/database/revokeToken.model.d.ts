import { User } from './user.model.js';
export declare class revokeToken {
    id: string;
    token: string;
    expiresIn: Date;
    userId: string;
    user: User;
    type: string;
    timestamp: Date;
}
