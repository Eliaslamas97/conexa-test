export interface IMovie {
  id: string;
  title: string;
  episodeId: number;
  openingCrawl: string;
  director: string;
  producer: string;
  releaseDate: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  createdAt: Date;
  updatedAt: Date;
  url: string;
}
