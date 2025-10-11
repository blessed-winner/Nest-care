import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/user/entities/user.entity";
import { ROLES_KEY } from "../decorator/roles.decorator"


@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean {
          const isPublic = this.reflector.get<boolean>('isPublic',context.getHandler())
          if(isPublic) return true
          
          const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
              context.getHandler(),
              context.getClass()
          ])
          if(!requiredRoles) return true
          const { user } = context.switchToHttp().getRequest()
          return requiredRoles.includes(user.role)
        }
}