import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  episodeId: number;

  @Column('text')
  openingCrawl: string;

  @Column()
  director: string;

  @Column()
  producer: string;

  @Column()
  releaseDate: string;

  @Column('text', { array: true })
  characters: string[];

  @Column('text', { array: true })
  planets: string[];

  @Column('text', { array: true })
  starships: string[];

  @Column('text', { array: true })
  vehicles: string[];

  @Column('text', { array: true })
  species: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  url: string;
}
