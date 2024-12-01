import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { MovieService } from '@src/modules/movies/application/services/movie.service';
import { CreateMovieDto } from '@src/modules/movies/domain/dtos/create-movie.dto';
import { UpdateMovieDto } from '@src/modules/movies/domain/dtos/update-movie.dto';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: 'Create new movie' })
  async createMovie(createMovieDto: CreateMovieDto) {
    return await this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all movies' })
  async listMovies() {
    return await this.movieService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id' })
  async getMovieById(id: string) {
    return await this.movieService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update movie by id' })
  async updateMovie(id: string, updateMovieDto: UpdateMovieDto) {
    return await this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie by id' })
  async deleteMovie(id: string) {
    return await this.movieService.delete(id);
  }
}
