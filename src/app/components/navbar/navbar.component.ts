import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { UserToken } from '../../models/user-token.model';
import { Roles } from './../../models/user-roles.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub = new Subscription();
  public isAuthenticated = false;
  public user = <UserToken>{};
  public roles = Roles;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.userToken$.subscribe((user) => {
      this.isAuthenticated = !!user; // user ? true : false;
      this.user = user;
    });
  }

  public isProviderAdmin() {
    if (this.isAuthenticated)
      return this.user.roles.includes(this.roles.ProviderAdmin);
    else return false;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  public logout(): void {
    this.authService.logout();
  }
}
