import { Inject, Injectable } from '@nestjs/common';
import { IMovieRepository } from '@src/modules/movies/domain/repositories/movie.repository';
import { MOVIE_REPOSITORY } from '@src/modules/movies/symbols';
import { CreateMovieDto } from '@src/modules/movies/domain/dtos/create-movie.dto';
import { v4 as uuidv4 } from 'uuid';
import { IMovie } from '@src/modules/movies/domain/interfaces/movie.interface';
import { UpdateMovieDto } from '@src/modules/movies/domain/dtos/update-movie.dto';
import { identity, merge, pickBy } from 'lodash';

@Injectable()
export class MovieService {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<IMovie> {
    const newMovie: IMovie = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...createMovieDto,
    };
    return await this.movieRepository.create(newMovie);
  }

  async list(): Promise<IMovie[]> {
    return await this.movieRepository.list();
  }

  async findById(id: string): Promise<IMovie> {
    return await this.movieRepository.findById(id);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<IMovie> {
    const movie = await this.movieRepository.findById(id);
    const updateData = pickBy(
      { updatedAt: new Date(), ...updateMovieDto },
      identity,
    );
    const movieUpdated = merge({}, movie, updateData);
    return await this.movieRepository.update(id, movieUpdated);
  }

  async delete(id: string): Promise<boolean> {
    return await this.movieRepository.delete(id);
  }
}
