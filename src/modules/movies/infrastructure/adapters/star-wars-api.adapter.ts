import { Injectable } from '@nestjs/common';
import { IStarWarsApiPort } from '@src/modules/movies/domain/ports/star-wars-api.port';
import { IMovie } from '@src/modules/movies/domain/interfaces/movie.interface';
import axios from 'axios';

@Injectable()
export class StarWarsApiAdapter implements IStarWarsApiPort {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = 'https://swapi.dev/api/';
  }

  async fetchMovies(): Promise<IMovie[]> {
    try {
      const url = `${this.baseUrl}films/`;
      const response = await axios.get(url);
      return response?.data?.results;
    } catch (error) {
      throw new Error('Failed to fetch movies from Star Wars API');
    }
  }
}
