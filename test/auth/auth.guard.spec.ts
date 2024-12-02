import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = new JwtService({});
    reflector = new Reflector();
    configService = new ConfigService();
    authGuard = new AuthGuard(jwtService, reflector, configService);
  });

  it('should allow access to public routes', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: jest.fn(),
      }),
    } as unknown as ExecutionContext;

    const result = await authGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw an error if token is missing', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: '',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid token'),
    );
  });

  it('should throw an error if token is invalid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    jest.spyOn(configService, 'get').mockReturnValue('test-secret');
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid token'),
    );
  });

  it('should allow access if token is valid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const mockUser = { sub: 1, username: 'John Doe', role: 1 };
    jest.spyOn(configService, 'get').mockReturnValue('test-secret');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockUser);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => {
          const req = {
            headers: {
              authorization: 'Bearer valid-token',
            },
          };
          req['user'] = mockUser;
          return req;
        },
      }),
    } as unknown as ExecutionContext;

    const result = await authGuard.canActivate(context);

    const request = context.switchToHttp().getRequest();
    expect(request['user']).toEqual(mockUser);

    expect(result).toBe(true);
  });
});
