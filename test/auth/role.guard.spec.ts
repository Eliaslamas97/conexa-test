import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '@src/guards/role.guard';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {
    reflector = new Reflector();
    jwtService = new JwtService({});
    configService = new ConfigService();
    rolesGuard = new RolesGuard(reflector, jwtService, configService);
  });
  it('should allow access if the user has the correct role', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([0, 1]);
    jest.spyOn(reflector, 'get').mockReturnValue([1, 2]);

    const mockUser = { sub: 1, username: 'John Doe', role: 1 };
    jest.spyOn(configService, 'get').mockReturnValue('test-secret');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockUser);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid-token' },
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await rolesGuard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if the user does not have the correct role', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([0, 1]);
    jest.spyOn(reflector, 'get').mockReturnValue([1, 2]);

    const mockUser = { sub: 1, username: 'John Doe', role: 3 };
    jest.spyOn(configService, 'get').mockReturnValue('test-secret');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockUser);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid-token' },
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(rolesGuard.canActivate(context)).rejects.toThrow(
      new ForbiddenException(
        'You do not have permission to access this resource',
      ),
    );
  });
});
