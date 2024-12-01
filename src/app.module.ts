import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@src/database/postgres/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@src/modules/users/user.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { MovieModule } from '@src/modules/movies/movie.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
