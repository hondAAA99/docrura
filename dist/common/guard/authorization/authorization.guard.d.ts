export declare const access_roles = "ACCESS_ROLES";
export declare function authorizationGuard(roles: string[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
