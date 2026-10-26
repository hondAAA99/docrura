import { CanActivate, ExecutionContext } from '@nestjs/common';
import { revokeTokensRepo } from '../../repository/revokeToken.repo.js';
export declare class tokenRevokeGuard implements CanActivate {
    private readonly revokeTokenRepo;
    constructor(revokeTokenRepo: revokeTokensRepo);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
