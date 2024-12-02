import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from '@src/modules/movies/application/services/movie.service';
import { CreateMovieDto } from '@src/modules/movies/domain/dtos/create-movie.dto';
import { UpdateMovieDto } from '@src/modules/movies/domain/dtos/update-movie.dto';
import { Roles } from '@src/decorators/role.decorator';
import { AuthGuard } from '@src/guards/auth.guard';
import { RolesGuard } from '@src/guards/role.guard';

@ApiTags('Movie')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Roles(1)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create new movie' })
  async createMovie(@Body() createMovieDto: CreateMovieDto) {
    return await this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all movies' })
  async listMovies() {
    return await this.movieService.list();
  }

  @Roles(0, 1)
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id' })
  async getMovieById(@Param('id') id: string) {
    return await this.movieService.findById(id);
  }

  @Roles(1)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update movie by id' })
  async updateMovie(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return await this.movieService.update(id, updateMovieDto);
  }

  @Roles(1)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie by id' })
  async deleteMovie(@Param('id') id: string) {
    return await this.movieService.delete(id);
  }
}
