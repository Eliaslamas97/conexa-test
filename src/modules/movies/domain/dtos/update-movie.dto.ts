import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateMovieDto {
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
