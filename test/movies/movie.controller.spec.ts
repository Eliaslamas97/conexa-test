import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from '@src/modules/movies/application/services/movie.service';
import { CreateMovieDto } from '@src/modules/movies/domain/dtos/create-movie.dto';
import { MovieController } from '@src/modules/movies/infrastructure/controllers/movie.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IMovie } from '@src/modules/movies/domain/interfaces/movie.interface';
import { UpdateMovieDto } from '@src/modules/movies/domain/dtos/update-movie.dto';

describe('MovieController - createMovie', () => {
  let controller: MovieController;
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            create: jest.fn(),
            list: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should create a movie', async () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Test Movie',
      episodeId: 1,
      openingCrawl: 'A long time ago...',
      director: 'John Doe',
      producer: 'Jane Smith',
      releaseDate: '2024-01-01',
      characters: ['Luke Skywalker'],
      planets: ['Tatooine'],
      starships: ['Millennium Falcon'],
      vehicles: ['Speeder'],
      species: ['Human'],
      url: 'http://example.com/movie',
    };

    const result = {
      ...createMovieDto,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.createMovie(createMovieDto)).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(createMovieDto);
  });

  it('should return a list of movies', async () => {
    const movies: IMovie[] = [
      {
        id: '1',
        title: 'Movie 1',
        episodeId: 1,
        openingCrawl: 'Opening crawl 1',
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
        url: 'http://example.com/movie1',
      },
      {
        id: '2',
        title: 'Movie 2',
        episodeId: 2,
        openingCrawl: 'Opening crawl 2',
        director: 'Director 2',
        producer: 'Producer 2',
        releaseDate: '2024-02-01',
        characters: ['Character 2'],
        planets: ['Planet 2'],
        starships: ['Starship 2'],
        vehicles: ['Vehicle 2'],
        species: ['Species 2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'http://example.com/movie2',
      },
    ];

    jest.spyOn(service, 'list').mockResolvedValue(movies);

    expect(await controller.listMovies()).toEqual(movies);
    expect(service.list).toHaveBeenCalledTimes(1);
  });

  it('should return a movie by id', async () => {
    const movie = {
      id: '1',
      title: 'Movie 1',
      episodeId: 1,
      openingCrawl: 'Opening crawl 1',
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
      url: 'http://example.com/movie1',
    };

    jest.spyOn(service, 'findById').mockResolvedValue(movie);

    expect(await controller.getMovieById('1')).toEqual(movie);
    expect(service.findById).toHaveBeenCalledWith('1');
  });

  it('should update a movie by id', async () => {
    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie',
    };

    const existingMovie: IMovie = {
      id: '1',
      title: 'Original Movie',
      episodeId: 1,
      openingCrawl: 'Original opening crawl',
      director: 'Original Director',
      producer: 'Original Producer',
      releaseDate: '2024-01-01',
      characters: ['Character 1'],
      planets: ['Planet 1'],
      starships: ['Starship 1'],
      vehicles: ['Vehicle 1'],
      species: ['Species 1'],
      createdAt: new Date(),
      updatedAt: new Date(),
      url: 'http://example.com/original-movie',
    };

    const updatedMovie: IMovie = {
      ...existingMovie,
      ...updateMovieDto,
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedMovie);
    jest.spyOn(service, 'findById').mockResolvedValue(existingMovie);

    expect(await controller.updateMovie('1', updateMovieDto)).toEqual(
      updatedMovie,
    );
    expect(service.update).toHaveBeenCalledWith('1', updateMovieDto);
  });

  it('should delete a movie by id', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue(true);

    expect(await controller.deleteMovie('1')).toEqual(true);
    expect(service.delete).toHaveBeenCalledWith('1');
  });
});
