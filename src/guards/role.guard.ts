import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '@src/decorators/role.decorator';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.get<number[]>(
        ROLES_KEY,
        context.getHandler(),
      );
      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new ForbiddenException('Token is missing or invalid');
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = await this.jwtService.verifyAsync(token, {
        secret,
      });

      const userRole = decoded.role;
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
