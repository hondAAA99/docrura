import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
export function messageQueueFactory() {
    return ClientsModule.registerAsync([
        {
            name: 'NOTIFICATION_SERVICE',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config) => ({
                transport: Transport.RMQ,
                options: {
                    urls: [config.get('MESSAGE_BROKER_URI')],
                    queue: 'notification',
                    queueOptions: { durable: true },
                },
            }),
        },
    ]);
}
//# sourceMappingURL=messageQueue.factory.js.map