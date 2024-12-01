import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@src/modules/users/application/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '@src/modules/auth/domain/dtos/register.dto';
import { SignInDto } from '@src/modules/auth/domain/dtos/sign-in.dto';
import { AuthResponse } from '@src/modules/auth/domain/interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto?.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    registerDto.password = await bcrypt.hash(registerDto?.password, 10);
    await this.userService.create(registerDto);

    return { message: 'User created successfully' };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(signInDto?.email);

    if (!user || !(await bcrypt.compare(signInDto?.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
