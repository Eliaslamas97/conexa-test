import {
  IsArray,
  IsOptional,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  title?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  episodeId?: number;

  @IsString()
  @IsOptional()
  @Length(10, 1000)
  @ApiProperty()
  openingCrawl?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  characters?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  planets?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  starships?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  vehicles?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  species?: string[];

  @IsString()
  @IsOptional()
  @IsUrl({}, { each: true })
  @ApiProperty()
  url?: string;
}
