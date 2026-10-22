import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../../module/auth/auth.service.js';
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly configService;
    private readonly _authService;
    constructor(configService: ConfigService, _authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<import("typeorm").DeepPartial<import("../../../database/user.model.js").User> & import("../../../database/user.model.js").User>;
}
export {};
