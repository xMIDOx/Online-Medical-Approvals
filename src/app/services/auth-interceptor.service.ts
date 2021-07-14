import { HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userToken$.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) return next.handle(req);
        const modifiedReq = req.clone({
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer ' + user.token
          ),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
