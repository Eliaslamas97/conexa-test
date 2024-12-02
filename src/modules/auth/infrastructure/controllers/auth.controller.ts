import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '@src/modules/auth/domain/dtos/register.dto';
import { SignInDto } from '@src/modules/auth/domain/dtos/sign-in.dto';
import { AuthResponse } from '@src/modules/auth/domain/interfaces/auth-response.interface';
import { AuthService } from '@src/modules/auth/application/services/auth.service';
import { Public } from '@src/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign In' })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponse> {
    return await this.authService.signIn(signInDto);
  }
}
