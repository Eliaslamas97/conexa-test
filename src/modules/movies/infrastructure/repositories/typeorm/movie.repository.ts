import { IMovieRepository } from '@src/modules/movies/domain/repositories/movie.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '@src/modules/movies/domain/entities/typeorm/movie.entity';
import { IMovie } from '@src/modules/movies/domain/interfaces/movie.interface';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieTable: Repository<MovieEntity>,
  ) {}

  async create(movie: IMovie): Promise<IMovie> {
    return await this.movieTable.save(movie);
  }

  async update(id: string, movie: IMovie): Promise<IMovie> {
    await this.movieTable.update(id, movie);
    return await this.movieTable.findOne({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    await this.movieTable.delete(id);
    return true;
  }

  async findById(id: string): Promise<IMovie> {
    return await this.movieTable.findOne({ where: { id } });
  }

  async list(): Promise<IMovie[]> {
    return await this.movieTable.find();
  }

  async findByTitle(title: string): Promise<IMovie> {
    return await this.movieTable.findOne({ where: { title } });
  }
}
