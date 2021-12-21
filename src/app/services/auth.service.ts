import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { UserToken } from '../models/user-token.model';
import { Register } from './../models/register.model';
import { User } from './../models/user.model';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userToken$ = new BehaviorSubject<UserToken>(null as any);
  private tokenExpirationTimer: any;
  private userLogin = { username: '', password: '', grant_type: 'password' };
  private endPoint = 'api/Account/';

  constructor(private http: GenericCRUDService, private router: Router) {}

  public signup(userRegisteration: Register) {
    return this.http.Create(this.endPoint + 'Register', userRegisteration);
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
        const user = new UserToken(
          res.userName,
          res.access_token,
          expirationDate,
          JSON.parse(res.roles)
        );
        this.userToken$.next(user);
        this.autoLogout(+res.expires_in * 1000);
        localStorage.setItem('userToken', JSON.stringify(user));
      })
    );
  }

  // to presist the token when app refresh
  public autoLogin(): void {
    const userData: UserToken = JSON.parse(localStorage.getItem('userToken')!);
    if (!userData) return;

    const loadUser = new UserToken(
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.roles
    );

    if (loadUser.token) {
      this.userToken$.next(loadUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  public logout() {
    this.userToken$.next(null as any);
    this.router.navigate(['/log-in']);
    localStorage.removeItem('userToken');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
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

  public getUser(): Observable<User> {
    return this.http.Get('api/user/getUser').pipe(
      map(res => res as User)
    )
  }

  public getAuthProviderUser(): Observable<User> {
    return this.http.Get('api/user/GetProviderUser').pipe(
      map(res => res as User)
    )
  }
}
