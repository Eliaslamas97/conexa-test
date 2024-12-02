import { IMovie } from '@src/modules/movies/domain/interfaces/movie.interface';

export interface IMovieRepository {
  list(): Promise<IMovie[]>;
  findById(id: string): Promise<IMovie>;
  create(movie: IMovie): Promise<IMovie>;
  update(id: string, movie: IMovie): Promise<IMovie>;
  delete(id: string): Promise<boolean>;
  findByTitle(title: string): Promise<IMovie>;
}
