import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
export function dataBaseFactory() {
    return MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService) => ({
            uri: configService.get('DATABASE_URL'),
            onConnectionCreate: (connection) => {
                connection.on('connected', () => {
                    console.log('✅ Connected to database');
                });
            },
        }),
        inject: [ConfigService],
    });
}
//# sourceMappingURL=database.factory.js.map