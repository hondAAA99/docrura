import { ConfigService } from '@nestjs/config';
export declare const sendEmail: () => Promise<void>;
export declare class emailService {
    private readonly _config;
    private readonly _transporter;
    constructor(_config: ConfigService);
    sendEmail({ to, subject, data, }: {
        to: string;
        subject: string;
        data: any;
    }): Promise<void>;
}
