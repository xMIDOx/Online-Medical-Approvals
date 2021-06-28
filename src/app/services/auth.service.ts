import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../models/user.model';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user = new BehaviorSubject<User>(null as any);
  private tokenExpirationTimer: any;
  private endPoint = 'api/Account/';
  private userRegister = { email: '', password: '', confirmPassword: '' };
  private userLogin = { username: '', password: '', grant_type: 'password' };

  constructor(private http: GenericCRUDService, private router: Router) {}

  signup(clientInput: any) {
    this.userRegister.email = clientInput.username;
    this.userRegister.password = clientInput.password;
    this.userRegister.confirmPassword = clientInput.password;

    return this.http.Create(this.endPoint + 'Register', this.userRegister);
  }

  login(clientInput: any) {
    this.userLogin.username = clientInput.username;
    this.userLogin.password = clientInput.password;
    let body = this.http.toQueryString(this.userLogin);

    return this.http.Create('Token', body).pipe(
      tap((res: any) => {
        const expirationDate = new Date(
          new Date().getTime() + +res.expires_in * 1000
        );
        const user = new User(res.userName, res.access_token, expirationDate);
        this.user.next(user);
        this.autoLogout(+res.expires_in * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
      })
    );
  }

  logout() {
    this.user.next(null as any);
    this.router.navigate(['/log-in']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // to presist the token when app refresh
  autoLogin(): void {
    const userData: User = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) return;

    const loadUser = new User(
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadUser.token){
      this.user.next(loadUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
