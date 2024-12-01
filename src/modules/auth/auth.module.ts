import { Module } from '@nestjs/common';
import { UserModule } from '@src/modules/users/user.module';
import { AuthController } from '@src/modules/auth/infrastructure/controllers/auth.controller';
import { AuthService } from '@src/modules/auth/application/services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
