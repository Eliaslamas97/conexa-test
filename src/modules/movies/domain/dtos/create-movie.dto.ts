import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  episodeId: number;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  openingCrawl: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsString()
  @IsNotEmpty()
  producer: string;

  @IsString()
  @IsNotEmpty()
  releaseDate: string;

  @IsArray()
  @IsOptional()
  characters: string[];

  @IsArray()
  @IsOptional()
  planets: string[];

  @IsArray()
  @IsOptional()
  starships: string[];

  @IsArray()
  @IsOptional()
  vehicles: string[];

  @IsArray()
  @IsOptional()
  species: string[];

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { each: true })
  url: string;
}
