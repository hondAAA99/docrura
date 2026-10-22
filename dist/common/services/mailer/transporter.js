import nodeMailer from 'nodemailer';
export function createTransporter(config) {
    const user = config.get('MAIL_APP_SENDER');
    const pass = config.get('MAIL_APP_PASSWORD');
    if (!user || !pass) {
        throw new Error('MAIL_APP_SENDER and MAIL_APP_PASSWORD must be configured to send email');
    }
    return nodeMailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });
}
//# sourceMappingURL=transporter.js.map