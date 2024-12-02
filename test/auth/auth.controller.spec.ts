import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/modules/auth/application/services/auth.service';
import { RegisterDto } from '@src/modules/auth/domain/dtos/register.dto';
import { AuthController } from '@src/modules/auth/infrastructure/controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '@src/modules/auth/domain/dtos/sign-in.dto';
import { AuthResponse } from '@src/modules/auth/domain/interfaces/auth-response.interface';

describe('AuthController - register', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            signIn: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should register a new user', async () => {
    const registerDto: RegisterDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const result = { message: 'User created successfully' };

    jest.spyOn(service, 'register').mockResolvedValue(result);

    expect(await controller.register(registerDto)).toEqual(result);
    expect(service.register).toHaveBeenCalledWith(registerDto);
  });

  it('should sign in a user and return a token', async () => {
    const signInDto: SignInDto = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response: AuthResponse = {
      access_token: 'mockToken123',
    };

    jest.spyOn(service, 'signIn').mockResolvedValue(response);

    expect(await controller.signIn(signInDto)).toEqual(response);
    expect(service.signIn).toHaveBeenCalledWith(signInDto);
  });
});
