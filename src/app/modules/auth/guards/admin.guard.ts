import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isAdmin = this.reflector.get<boolean>(
            'isAdmin',
            context.getHandler(),
        );

        if (!isAdmin) {
            return false;
        }

        // Logic to check if the user is an admin or has isAdmin = true

        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assuming you have the user object attached to the request
        return user.isAdmin === true;
    }
}
