import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@src/modules/users/application/services/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from '@src/modules/auth/domain/dtos/register.dto';
import { AuthService } from '@src/modules/auth/application/services/auth.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '@src/modules/auth/domain/dtos/sign-in.dto';
import { AuthResponse } from '@src/modules/auth/domain/interfaces/auth-response.interface';
import { jwtConstants } from '@src/modules/auth/domain/constants/jwt.constant';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userServiceMock: Partial<UserService>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    userServiceMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should throw BadRequestException if email already exists', async () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    userServiceMock.findByEmail = jest
      .fn()
      .mockResolvedValueOnce({ id: '1', ...registerDto });

    await expect(authService.register(registerDto)).rejects.toThrow(
      new BadRequestException('Email already exists'),
    );
  });

  it('should create a user if email does not exist', async () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    userServiceMock.findByEmail = jest.fn().mockResolvedValueOnce(null);
    userServiceMock.create = jest
      .fn()
      .mockResolvedValueOnce({ id: '1', ...registerDto });

    const result = await authService.register(registerDto);
    expect(result).toEqual({ message: 'User created successfully' });
    expect(userServiceMock.create).toHaveBeenCalledWith(
      expect.objectContaining(registerDto),
    );
  });

  it('should throw InternalServerErrorException if there is an unexpected error', async () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    userServiceMock.findByEmail = jest
      .fn()
      .mockRejectedValueOnce(new Error('Some error'));

    await expect(authService.register(registerDto)).rejects.toThrow(
      new InternalServerErrorException('Some error'),
    );
  });

  it('should throw UnauthorizedException if user does not exist or password is incorrect', async () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    userServiceMock.findByEmail = jest.fn().mockResolvedValueOnce(null);

    await expect(authService.signIn(signInDto)).rejects.toThrow(
      new UnauthorizedException('Invalid credentials'),
    );
  });

  it('should return an access token if the user exists and the password is correct', async () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      email: signInDto.email,
      password: await bcrypt.hash(signInDto.password, 10),
      roleId: 1,
    };

    userServiceMock.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jwtServiceMock.signAsync = jest.fn().mockResolvedValue('fake-token');

    const result: AuthResponse = await authService.signIn(signInDto);

    expect(result).toEqual({ access_token: 'fake-token' });
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
      { sub: mockUser.id, username: mockUser.email, role: mockUser.roleId },
      { expiresIn: jwtConstants.expiresIn, privateKey: jwtConstants.secret },
    );
  });

  it('should throw InternalServerErrorException if there is an unexpected error', async () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    userServiceMock.findByEmail = jest
      .fn()
      .mockRejectedValueOnce(new Error('Some error'));

    await expect(authService.signIn(signInDto)).rejects.toThrow(
      new InternalServerErrorException('Some error'),
    );
  });
});
