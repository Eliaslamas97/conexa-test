import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration } from '@src/config/config.enum';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
      type: 'postgres',
      host: configService.get(Configuration.DATABASE_HOST),
      port: configService.get(Configuration.DATABASE_PORT),
      username: configService.get(Configuration.DATABASE_USER),
      password: configService.get(Configuration.DATABASE_PASSWORD),
      database: configService.get(Configuration.DATABASE_NAME),
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    }),
  }),
];
