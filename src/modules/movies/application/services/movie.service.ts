import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      const newMovie: IMovie = {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createMovieDto,
      };
      return await this.movieRepository.create(newMovie);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async list(): Promise<IMovie[]> {
    try {
      return await this.movieRepository.list();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string): Promise<IMovie> {
    try {
      return await this.movieRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<IMovie> {
    try {
      const movie = await this.movieRepository.findById(id);
      if (!movie) {
        throw new InternalServerErrorException('Movie not found');
      }
      const updateData = pickBy(
        { updatedAt: new Date(), ...updateMovieDto },
        identity,
      );
      const movieUpdated = merge({}, movie, updateData);
      return await this.movieRepository.update(id, movieUpdated);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.movieRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
