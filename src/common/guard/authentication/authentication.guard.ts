import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { tokenSignatureGuard } from './tokenSignature.guard.js';
import { tokenRevokeGuard } from './tokenRevokness.guard.js';
import { tokenVerificationGuard } from './tokenVerification.guard.js';

export const ACCESS_TOKEN_TYPE = 'access-token-type'
export function authenticationGuard(accessTokenType : string) {
  return applyDecorators(
    SetMetadata(ACCESS_TOKEN_TYPE,accessTokenType),
    UseGuards(tokenSignatureGuard, tokenRevokeGuard, tokenVerificationGuard),
  );
}
