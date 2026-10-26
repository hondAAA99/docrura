var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { access_roles } from './authorization.guard.js';
let accessRolesGuard = class accessRolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        let req;
        const roles = this.reflector.get(access_roles, context.getHandler);
        if (context.getType() === 'http') {
            req = context.switchToHttp().getRequest();
        }
        else if (context.getType() === 'rpc') {
            req = context.switchToRpc().getContext();
        }
        else {
            req = context.switchToWs().getClient();
        }
        if (!roles.includes(req.decode.userRole))
            throw new UnauthorizedException('you are not allowed to access this operation');
        return true;
    }
};
accessRolesGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector])
], accessRolesGuard);
export { accessRolesGuard };
//# sourceMappingURL=accessRole.guard.js.map