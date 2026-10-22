import { ConfigService } from '@nestjs/config';
import nodeMailer from 'nodemailer';

export function createTransporter(config: ConfigService) {
  const user = config.get<string>('MAIL_APP_SENDER');
  const pass = config.get<string>('MAIL_APP_PASSWORD');

  if (!user || !pass) {
    throw new Error(
      'MAIL_APP_SENDER and MAIL_APP_PASSWORD must be configured to send email',
    );
  }

  return nodeMailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}
