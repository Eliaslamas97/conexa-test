import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { RegisterDto } from '@src/modules/auth/domain/dtos/register.dto';
import { SignInDto } from '@src/modules/auth/domain/dtos/sign-in.dto';
import { AuthResponse } from '@src/modules/auth/domain/interfaces/auth-response.interface';
import { AuthService } from '@src/modules/auth/application/services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign In' })
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    return await this.authService.signIn(signInDto);
  }
}
