import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { UserToken } from '../../models/user-token.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub = new Subscription();
  public isAuthenticated = false;
  public user = <UserToken>{};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.userToken$.subscribe((user) => {
      this.isAuthenticated = !!user; // user ? true : false;
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  public logout(): void {
    this.authService.logout();
  }
}
