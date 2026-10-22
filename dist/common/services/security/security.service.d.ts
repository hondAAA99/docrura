import { ConfigService } from '@nestjs/config';
export declare class securityServices {
    private readonly configService;
    constructor(configService: ConfigService);
    globalHash(plainText: string): string;
    GlobalCompare(plainText: string, hashText: string): boolean;
    Globaldecrypt(cipherText: string): string;
    Globalencrypt(plainText: string): string;
}
