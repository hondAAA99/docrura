var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync, hashSync } from 'bcrypt';
import crypto from 'node:crypto';
let securityServices = class securityServices {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    globalHash(plainText) {
        let hashedText = hashSync(plainText, 10).toString();
        return hashedText;
    }
    GlobalCompare(plainText, hashText) {
        return compareSync(plainText, hashText);
    }
    Globaldecrypt(cipherText) {
        const [ivHex, cipherHex] = cipherText.split(':');
        const key = Buffer.from(this.configService.getOrThrow('ENCRYPTION_KEY'), 'hex');
        const decipher = crypto.createDecipheriv(this.configService.getOrThrow('ENCRYPTION_ALGORITHM'), key, Buffer.from(ivHex, 'hex'));
        let plain = decipher.update(cipherHex, 'hex', 'utf-8');
        plain += decipher.final('utf-8');
        return plain;
    }
    Globalencrypt(plainText) {
        const iv = crypto.randomBytes(Number(this.configService.getOrThrow('CIPHER_IV_SIZE')));
        const key = Buffer.from(this.configService.getOrThrow('ENCRYPTION_KEY'), 'hex');
        const cipher = crypto.createCipheriv(this.configService.getOrThrow('ENCRYPTION_ALGORITHM'), key, iv);
        let cipherText = cipher.update(plainText, 'utf-8', 'hex');
        cipherText += cipher.final('hex');
        return iv.toString('hex') + ':' + cipherText;
    }
};
securityServices = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], securityServices);
export { securityServices };
//# sourceMappingURL=security.service.js.map