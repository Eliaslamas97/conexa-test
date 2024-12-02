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
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  episodeId: number;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  @ApiProperty()
  openingCrawl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  director: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  producer: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  releaseDate: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  characters: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  planets: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  starships: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  vehicles: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  species: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsUrl({}, { each: true })
  url: string;
}
