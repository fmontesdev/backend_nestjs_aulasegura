import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se requieren roles, permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtien el usuario autenticado del request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si el usuario no tiene roles definidos, lanza una excepción
    if (!user || !user.roles) {
      throw new ForbiddenException('Usuario sin roles definidos');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    // Si no tiene el rol requerido, lanza una excepción
    if (!hasRole) {
      throw new ForbiddenException('No tienes los permisos necesarios');
    }

    return hasRole;
  }
}
