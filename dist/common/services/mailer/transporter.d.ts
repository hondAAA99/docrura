import { ConfigService } from '@nestjs/config';
export declare function createTransporter(config: ConfigService): import("nodemailer").Mail<import("nodemailer").SMTPSentMessageInfo, import("nodemailer").SMTPTransportOptions>;
