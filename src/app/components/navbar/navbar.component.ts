import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { User } from './../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub = new Subscription();
  public isAuthenticated = false;
  public user = <User>{};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.userSubject.subscribe((user) => {
      this.isAuthenticated = !!user; // user ? true : false;
      this.user = user
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  public logout(): void {
    this.authService.logout();
  }
}
