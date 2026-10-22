import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { userRoles } from '../../enum/user.base.enum.js';
import { userPayload } from '../../types/userPayload.type.js';
export declare class tokenService {
    private readonly _jwt;
    private readonly _config;
    constructor(_jwt: JwtService, _config: ConfigService);
    generateToken(payload: {
        userId: string;
        userRole: string;
    }, expiresIn: number, secret: string): string;
    verifyToken(token: string, secret: string): userPayload;
    getAccessAndRefreshSecrets(role: userRoles, _config: ConfigService): {
        accessSecret: string | undefined;
        refreshSecret: string | undefined;
    };
}
