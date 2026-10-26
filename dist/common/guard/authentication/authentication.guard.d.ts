export declare const ACCESS_TOKEN_TYPE = "access-token-type";
export declare function authenticationGuard(accessTokenType: string): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
