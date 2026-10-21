import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/user.model.js';
import fs from 'node:fs';
import path from 'node:path';
export function dataBaseFactory() {
    return TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config) => ({
            type: 'postgres',
            host: config.get('DB_HOST'),
            port: config.get('DB_PORT'),
            username: config.get('DB_USERNAME'),
            password: config.get('DB_PASSWORD'),
            database: config.get('DB_NAME'),
            autoLoadEntities: true,
            synchronize: true,
            entities: [User],
            ssl: {
                rejectUnauthorized: true,
                ca: fs.readFileSync(path.resolve('database_certificate.txt')),
            },
        }),
    });
}
//# sourceMappingURL=database.factory.js.map