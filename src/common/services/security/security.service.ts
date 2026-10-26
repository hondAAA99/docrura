import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync, hashSync } from 'bcrypt';
import crypto from 'node:crypto';
@Injectable()
export class securityServices {
  constructor(private readonly configService: ConfigService) {}
  globalHash(plainText: string) {
    let hashedText = hashSync(plainText, 10).toString();
    return hashedText;
  }
  GlobalCompare(plainText: string, hashText: string) {
    return compareSync(plainText, hashText);
  }

  Globaldecrypt(cipherText: string) {
    const [ivHex, cipherHex] = cipherText.split(':');
    const key = Buffer.from(
      this.configService.getOrThrow<string>('ENCRYPTION_KEY'),
      'hex',
    );
    const decipher = crypto.createDecipheriv(
      this.configService.getOrThrow<string>('ENCRYPTION_ALGORITHM'),
      key,
      Buffer.from(ivHex, 'hex'),
    );

    let plain = decipher.update(cipherHex, 'hex', 'utf-8');
    plain += decipher.final('utf-8');
    return plain;
  }

  Globalencrypt(plainText: string) {
    const iv = crypto.randomBytes(
      Number(this.configService.getOrThrow('CIPHER_IV_SIZE')),
    );
    const key = Buffer.from(
      this.configService.getOrThrow<string>('ENCRYPTION_KEY'),
      'hex',
    );
    const cipher = crypto.createCipheriv(
      this.configService.getOrThrow<string>('ENCRYPTION_ALGORITHM'),
      key,
      iv,
    );

    let cipherText = cipher.update(plainText, 'utf-8', 'hex');
    cipherText += cipher.final('hex');

    return iv.toString('hex') + ':' + cipherText;
  }
}
