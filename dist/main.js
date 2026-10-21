import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule, ObserveInstrument } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument,
    });
    const config = new ConfigService();
    app
        .connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [config.get('MESSAGE_BROKER_URI')],
            queue: 'notification',
            queueOptions: {
                durable: true,
            },
        },
    })
        .on('connect', () => {
        console.log('connected to message broker');
    });
    app.startAllMicroservices();
    app.use(cors());
    const port = process.env.PORT ?? 8000;
    await app.listen(port).then(() => console.log(`server listening on ${port}`));
}
await bootstrap();
//# sourceMappingURL=main.js.map