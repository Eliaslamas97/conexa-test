import { IMovie } from '@src/modules/movies/domain/interfaces/movie.interface';

export interface IStarWarsApiPort {
  fetchMovies(): Promise<IMovie[]>;
}
