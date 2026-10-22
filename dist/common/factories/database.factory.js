import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/user.model.js';
export function dataBaseFactory() {
    return TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config) => ({
            type: 'postgres',
            url: config.get('DB_URI'),
            autoLoadEntities: true,
            synchronize: true,
            entities: [User],
        }),
    });
}
//# sourceMappingURL=database.factory.js.map