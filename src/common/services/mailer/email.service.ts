import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { emailTemplate } from './email.templetes.js';
import { createTransporter } from './transporter.js';

export const sendEmail = async () => {};

@Injectable()
export class emailService {
  private readonly _transporter;

  constructor(private readonly _config: ConfigService) {
    this._transporter = createTransporter(this._config);
  }

  async sendEmail({
    to,
    subject,
    data,
  }: {
    to: string;
    subject: string;
    data: any;
  }) {
    await this._transporter.sendMail({
      from: this._config.get<string>('MAIL_APP_SENDER'),
      to,
      subject,
      html: emailTemplate(data),
    });
  }
}
