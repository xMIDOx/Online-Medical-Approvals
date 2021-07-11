import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { User } from '../models/user.model';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userSubject = new BehaviorSubject<User>(null as any);
  private tokenExpirationTimer: any;
  private endPoint = 'api/Account/';
  private userLogin = { username: '', password: '', grant_type: 'password' };

  constructor(private http: GenericCRUDService, private router: Router) {}

  public signup(clientInput: any) {
    return this.http.Create(this.endPoint + 'Register', clientInput);
  }

  public login(clientInput: any) {
    this.userLogin.username = clientInput.username;
    this.userLogin.password = clientInput.password;
    let body = this.http.toQueryString(this.userLogin);

    return this.http.Create('Token', body).pipe(
      tap((res: any) => {
        const expirationDate = new Date(
          new Date().getTime() + +res.expires_in * 1000
        );
        const user = new User(
          res.userName,
          res.access_token,
          expirationDate,
          JSON.parse(res.roles)
        );
        this.userSubject.next(user);
        this.autoLogout(+res.expires_in * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
      })
    );
  }

  public logout() {
    this.userSubject.next(null as any);
    this.router.navigate(['/log-in']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // to presist the token when app refresh
  public autoLogin(): void {
    const userData: User = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) return;

    const loadUser = new User(
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.roles
    );

    if (loadUser.token) {
      this.userSubject.next(loadUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  public isAuthorized(allowedRoles: string[], userRoles: string[]): boolean {
    let isMatch = false;

    allowedRoles.forEach((role) => {
      if (userRoles.indexOf(role) > -1) isMatch = true;
      return isMatch;
    });
    return isMatch;
  }
}
