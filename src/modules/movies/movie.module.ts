import { Module } from '@nestjs/common';
import { MOVIE_REPOSITORY } from '@src/modules/movies/symbols';
import { MovieRepository } from '@src/modules/movies/infrastructure/repositories/movie.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '@src/modules/movies/domain/entities/typeorm/movie.entity';
import { MovieService } from '@src/modules/movies/application/services/movie.service';
import { MovieController } from '@src/modules/movies/infrastructure/controllers/movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  controllers: [MovieController],
  providers: [
    { provide: MOVIE_REPOSITORY, useClass: MovieRepository },
    MovieService,
  ],
  exports: [],
})
export class MovieModule {}
