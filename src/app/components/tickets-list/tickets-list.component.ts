import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';
import { Roles } from 'src/app/models/user-roles.enum';
import { AuthService } from 'src/app/services/auth.service';

import { ClaimPhoto } from './../../models/claim-photo.model';
import { OnlineEntryType } from './../../models/online-entry-type.enum';
import { UserToken } from './../../models/user-token.model';
import { User } from './../../models/user.model';
import { ClaimPhotoService } from './../../services/claim-photo.service';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.css'],
})
export class TicketsListComponent implements OnInit {
  public tickets$ = new Observable<ClaimPhoto[]>();
  public dtOptions: DataTables.Settings = {};
  public ERoles = Roles;
  private userToken = <UserToken>{};

  constructor(
    private claimPhotoService: ClaimPhotoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserTickets();
  }

  public getUserTickets() {
    this.tickets$ = combineLatest([this.authService.userToken$,this.authService.getUser()])
    .pipe(
      take(1),
      switchMap((combined: [UserToken, User]) => {
        this.userToken = combined[0];
        if (this.isSelectedRole(Roles.Doctor))
          return this.claimPhotoService.getDoctorTickets(combined[1].id);
        else return this.getTickets();
      })
    );
  }

  public isSelectedRole(role: string): boolean {
    return this.userToken.roles.includes(role);
  }

  private getTickets(): Observable<ClaimPhoto[]> {
    return this.claimPhotoService.getClaimsPhotos(
      ApprovalOnlineStatus.pending,
      OnlineEntryType.Ticket
    );
  }
}
