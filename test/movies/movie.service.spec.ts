import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { IMovieRepository } from '@src/modules/movies/domain/repositories/movie.repository';
import { MOVIE_REPOSITORY } from '@src/modules/movies/symbols';
import { CreateMovieDto } from '@src/modules/movies/domain/dtos/create-movie.dto';
import { v4 as uuidv4 } from 'uuid';
import { MovieService } from '@src/modules/movies/application/services/movie.service';
import { IMovie } from '@src/modules/movies/domain/interfaces/movie.interface';
import { UpdateMovieDto } from '@src/modules/movies/domain/dtos/update-movie.dto';
import { merge } from 'lodash';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepositoryMock: IMovieRepository;

  beforeEach(async () => {
    movieRepositoryMock = {
      create: jest.fn() as jest.Mock<Promise<IMovie>, [IMovie]>,
      list: jest.fn() as jest.Mock<Promise<IMovie[]>, []>,
      findById: jest.fn() as jest.Mock<Promise<IMovie>, [string]>,
      update: jest.fn() as jest.Mock<Promise<IMovie>, [string, IMovie]>,
      delete: jest.fn() as jest.Mock<Promise<boolean>, [string]>,
      findByTitle: jest.fn() as jest.Mock<Promise<IMovie>, [string]>,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MOVIE_REPOSITORY,
          useValue: movieRepositoryMock,
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
  });

  describe('create', () => {
    it('should successfully create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Movie Title',
        episodeId: 1,
        openingCrawl: 'Opening Crawl Text',
        director: 'Director Name',
        producer: 'Producer Name',
        releaseDate: '2024-12-01',
        characters: ['Character 1', 'Character 2'],
        planets: ['Planet 1'],
        starships: ['Starship 1'],
        vehicles: ['Vehicle 1'],
        species: ['Species 1'],
        url: 'http://example.com/movie',
      };

      const expectedMovie = {
        id: 'mock-uuid',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        ...createMovieDto,
      };

      (movieRepositoryMock.create as jest.Mock).mockResolvedValue(
        expectedMovie,
      );

      const result = await movieService.create(createMovieDto);

      expect(result).toEqual(expectedMovie);
      expect(movieRepositoryMock.create).toHaveBeenCalledWith(expectedMovie);
    });

    it('should throw InternalServerErrorException if movie creation fails', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Movie Title',
        episodeId: 1,
        openingCrawl: 'Opening Crawl Text',
        director: 'Director Name',
        producer: 'Producer Name',
        releaseDate: '2024-12-01',
        characters: ['Character 1', 'Character 2'],
        planets: ['Planet 1'],
        starships: ['Starship 1'],
        vehicles: ['Vehicle 1'],
        species: ['Species 1'],
        url: 'http://example.com/movie',
      };

      const errorMessage = 'Error creating movie';
      (movieRepositoryMock.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      try {
        await movieService.create(createMovieDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('list', () => {
    it('should return a list of movies', async () => {
      const expectedMovies: IMovie[] = [
        {
          id: '1',
          title: 'Movie 1',
          episodeId: 1,
          openingCrawl: 'Some crawl text',
          director: 'Director 1',
          producer: 'Producer 1',
          releaseDate: '2024-01-01',
          characters: ['Character 1'],
          planets: ['Planet 1'],
          starships: ['Starship 1'],
          vehicles: ['Vehicle 1'],
          species: ['Species 1'],
          createdAt: new Date(),
          updatedAt: new Date(),
          url: 'https://movie1.com',
        },
        {
          id: '2',
          title: 'Movie 2',
          episodeId: 2,
          openingCrawl: 'Some other crawl text',
          director: 'Director 2',
          producer: 'Producer 2',
          releaseDate: '2024-01-02',
          characters: ['Character 2'],
          planets: ['Planet 2'],
          starships: ['Starship 2'],
          vehicles: ['Vehicle 2'],
          species: ['Species 2'],
          createdAt: new Date(),
          updatedAt: new Date(),
          url: 'https://movie2.com',
        },
      ];
      (movieRepositoryMock.list as jest.Mock).mockResolvedValue(expectedMovies);

      const result = await movieService.list();

      expect(result).toEqual(expectedMovies);
      expect(movieRepositoryMock.list).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException if there is an error', async () => {
      (movieRepositoryMock.list as jest.Mock).mockRejectedValue(
        new Error('Error while fetching movies'),
      );
      await expect(movieService.list()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findById', () => {
    it('should return a movie when found', async () => {
      const expectedMovie: IMovie = {
        id: '1',
        title: 'Movie 1',
        episodeId: 1,
        openingCrawl: 'Some crawl text',
        director: 'Director 1',
        producer: 'Producer 1',
        releaseDate: '2024-01-01',
        characters: ['Character 1'],
        planets: ['Planet 1'],
        starships: ['Starship 1'],
        vehicles: ['Vehicle 1'],
        species: ['Species 1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://movie1.com',
      };

      (movieRepositoryMock.findById as jest.Mock).mockResolvedValue(
        expectedMovie,
      );
      const result = await movieService.findById('1');

      expect(result).toEqual(expectedMovie);
      expect(movieRepositoryMock.findById).toHaveBeenCalledWith('1');
    });

    it('should throw an InternalServerErrorException if there is an error', async () => {
      (movieRepositoryMock.findById as jest.Mock).mockRejectedValue(
        new Error('Error while fetching movies'),
      );

      await expect(movieService.findById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update the movie successfully', async () => {
      const existingMovie: IMovie = {
        id: '1',
        title: 'Movie 1',
        episodeId: 1,
        openingCrawl: 'Some crawl text',
        director: 'Director 1',
        producer: 'Producer 1',
        releaseDate: '2024-01-01',
        characters: ['Character 1'],
        planets: ['Planet 1'],
        starships: ['Starship 1'],
        vehicles: ['Vehicle 1'],
        species: ['Species 1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://movie1.com',
      };

      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie 1',
        episodeId: 2,
        openingCrawl: 'Updated crawl text',
        characters: ['Character 1', 'Character 2'],
      };

      const updatedMovie: IMovie = merge({}, existingMovie, {
        ...updateMovieDto,
        updatedAt: new Date(),
      });

      (movieRepositoryMock.findById as jest.Mock).mockResolvedValue(
        existingMovie,
      );
      (movieRepositoryMock.update as jest.Mock).mockResolvedValue(updatedMovie);

      const result = await movieService.update('1', updateMovieDto);

      expect(result).toEqual({
        ...updatedMovie,
        updatedAt: expect.any(Date),
      });
      expect(movieRepositoryMock.findById).toHaveBeenCalledWith('1');
      expect(movieRepositoryMock.update).toHaveBeenCalledWith('1', {
        ...updatedMovie,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw an InternalServerErrorException if there is an error during update', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie 1',
      };

      const existingMovie: IMovie = {
        id: '1',
        title: 'Movie 1',
        episodeId: 1,
        openingCrawl: 'Some crawl text',
        director: 'Director 1',
        producer: 'Producer 1',
        releaseDate: '2024-01-01',
        characters: ['Character 1'],
        planets: ['Planet 1'],
        starships: ['Starship 1'],
        vehicles: ['Vehicle 1'],
        species: ['Species 1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://movie1.com',
      };

      (movieRepositoryMock.findById as jest.Mock).mockResolvedValue(
        existingMovie,
      );

      (movieRepositoryMock.update as jest.Mock).mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(movieService.update('1', updateMovieDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the movie successfully', async () => {
      const movieId = '1';
      const expectedResult = true;

      (movieRepositoryMock.delete as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await movieService.delete(movieId);
      expect(result).toBe(expectedResult);
      expect(movieRepositoryMock.delete).toHaveBeenCalledWith(movieId);
    });

    it('should throw an InternalServerErrorException if there is an error during deletion', async () => {
      const movieId = '1';

      (movieRepositoryMock.delete as jest.Mock).mockRejectedValue(
        new Error('Error while fetching movies'),
      );

      await expect(movieService.delete(movieId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
