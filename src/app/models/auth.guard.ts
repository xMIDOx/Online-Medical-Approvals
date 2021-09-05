import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.userToken$.pipe(
      take(1),
      map((user) => {
        const isAuthenticated: boolean = !!user;
        if (!isAuthenticated) return this.router.createUrlTree(['/log-in']);

        const roles: string[] = route.data['roles'];
        if (!roles) return true;

        const isMatch: boolean = this.authService.isAuthorized(roles, user.roles);
        return isMatch ? true : this.router.createUrlTree(['/forbidden']);
      })
    );
  }
}
