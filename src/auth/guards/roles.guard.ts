import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from 'index';
import { AuthService } from '../auth.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const {
      headers: { authorization },
    } = context.switchToHttp().getRequest();

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.split(' ')[1];
    const verifyOptions = {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiry'),
    };
    try {
      const TokenDetails = await this.jwt.verifyAsync(token, verifyOptions);
      const { email } = TokenDetails;
      const user: User = await this.authService.findByUserEmail(email);

      if (user) {
        return requiredRoles.includes(user.role);
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
