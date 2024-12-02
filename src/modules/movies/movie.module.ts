import { Module } from '@nestjs/common';
import {
  MOVIE_REPOSITORY,
  STAR_WARS_API_ADAPTER,
} from '@src/modules/movies/symbols';
import { MovieRepository } from '@src/modules/movies/infrastructure/repositories/typeorm/movie.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '@src/modules/movies/domain/entities/typeorm/movie.entity';
import { MovieService } from '@src/modules/movies/application/services/movie.service';
import { MovieController } from '@src/modules/movies/infrastructure/controllers/movie.controller';
import { StarWarsApiAdapter } from '@src/modules/movies/infrastructure/adapters/star-wars-api.adapter';
import { AuthGuard } from '@src/guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from '@src/guards/role.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MoviesCronService } from '@src/modules/movies/application/schedules/crons/movies-cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), JwtModule],
  controllers: [MovieController],
  providers: [
    { provide: MOVIE_REPOSITORY, useClass: MovieRepository },
    MovieService,
    StarWarsApiAdapter,
    { provide: STAR_WARS_API_ADAPTER, useClass: StarWarsApiAdapter },
    AuthGuard,
    ConfigService,
    RolesGuard,
    JwtService,
    MoviesCronService,
  ],
  exports: [],
})
export class MovieModule {}
