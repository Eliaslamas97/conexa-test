import { Module } from '@nestjs/common';
import { UserModule } from '@src/modules/users/user.module';
import { AuthController } from '@src/modules/auth/infrastructure/controllers/auth.controller';
import { AuthService } from '@src/modules/auth/application/services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@src/guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from '@src/guards/role.guard';
import { jwtConstants } from '@src/modules/auth/domain/constants/jwt.constant';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, AuthGuard, ConfigService, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
