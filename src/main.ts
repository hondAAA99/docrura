import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.use(cors());

  const port = process.env.PORT ?? 8000;

  await app.listen(port).then(() => console.log(`server listening on ${port}`));
}
await bootstrap();
