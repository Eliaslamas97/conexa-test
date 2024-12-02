import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  MOVIE_REPOSITORY,
  STAR_WARS_API_ADAPTER,
} from '@src/modules/movies/symbols';
import { IStarWarsApiPort } from '@src/modules/movies/domain/ports/star-wars-api.port';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IMovieRepository } from '@src/modules/movies/domain/repositories/movie.repository';
import { v4 as uuidV4 } from 'uuid';
import { get, identity, merge, omit, pickBy } from 'lodash';

@Injectable()
export class MoviesCronService {
  constructor(
    @Inject(STAR_WARS_API_ADAPTER)
    private readonly starWarsApiAdapter: IStarWarsApiPort,
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCron() {
    try {
      const movies = await this.starWarsApiAdapter.fetchMovies();
      for (const movie of movies) {
        const existing = await this.movieRepository.findByTitle(movie?.title);
        if (existing) {
          const parsedMovie = {
            episodeId: get(movie, 'episode_id', ''),
            openingCrawl: get(movie, 'opening_crawl', ''),
            releaseDate: get(movie, 'release_date', ''),
            updatedAt: get(movie, 'edited', new Date()),
            createdAt: get(movie, 'created', new Date()),
            ...omit(movie, [
              'episode_id',
              'opening_crawl',
              'release_date',
              'created',
              'edited',
            ]),
          };
          const updatedData = pickBy(parsedMovie, identity);
          const movieUpdated = merge({}, existing, updatedData);
          return await this.movieRepository.update(existing.id, movieUpdated);
        }
        await this.movieRepository.create({
          id: uuidV4(),
          createdAt: get(movie, 'created', new Date()),
          updatedAt: get(movie, 'edited', new Date()),
          episodeId: get(movie, 'episode_id', ''),
          openingCrawl: get(movie, 'opening_crawl', ''),
          releaseDate: get(movie, 'release_date', ''),
          ...movie,
        });
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Failed to synchronize movies');
    }
  }
}
