import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration } from '@src/config/config.enum';
import { CONEXA_TEST } from '@src/database/postgres/constants';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { RoleEntity } from '@src/modules/users/domain/entities/role.entity';
import { MovieEntity } from '@src/modules/movies/domain/entities/typeorm/movie.entity';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
      name: CONEXA_TEST,
      type: 'postgres',
      host: configService.get(Configuration.DATABASE_HOST),
      port: configService.get(Configuration.DATABASE_PORT),
      username: configService.get(Configuration.DATABASE_USER),
      password: configService.get(Configuration.DATABASE_PASSWORD),
      database: configService.get(Configuration.DATABASE_NAME),
      entities: [UserEntity, RoleEntity, MovieEntity],
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
  }),
];
