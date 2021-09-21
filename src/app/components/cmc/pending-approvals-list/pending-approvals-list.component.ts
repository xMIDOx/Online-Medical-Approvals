import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

import { ApprovalOnlineStatus } from './../../../models/approval-online-status.enum';
import { PendingApproval } from './../../../models/pending-approval.model';
import { Roles } from './../../../models/user-roles.enum';
import { UserToken } from './../../../models/user-token.model';
import { User } from './../../../models/user.model';
import { ApprovalService } from './../../../services/approval.service';

@Component({
  selector: 'app-pending-approvals-list',
  templateUrl: './pending-approvals-list.component.html',
  styleUrls: ['./pending-approvals-list.component.css'],
})
export class PendingApprovalsListComponent implements OnInit {
  public pendingApprovals$ = new Observable<PendingApproval[]>();
  public isProviderUser = false;
  public errorObject!: HttpErrorResponse;
  constructor(
    private approvalService: ApprovalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPendingApprovals();
  }

  private getPendingApprovals(): void {
    combineLatest([this.authService.userToken$, this.authService.getUser()])
      .pipe(
        take(1),
        map((combined: [UserToken, User]) => {
          return this.approvalsByUserRole(combined[0], combined[1]);
        })
      )
      .subscribe((result: Observable<PendingApproval[]>) => {
        this.pendingApprovals$ = result.pipe(
          catchError((error: HttpErrorResponse) => {
            this.errorObject = error;
            return throwError(error);
          })
        );
      });
  }

  private approvalsByUserRole(
    userToken: UserToken,
    user: User
  ): Observable<PendingApproval[]> {
    const isCMC = userToken.roles.includes(Roles.CMCDoctor);
    const isProviderUser = userToken.roles.includes(Roles.ProviderUser);
    const isProviderAdmin = userToken.roles.includes(Roles.ProviderAdmin);

    if (isProviderAdmin)
      return this.approvalService.getApprovals(undefined, user.providerId);
    if (isCMC)
      return this.approvalService.getApprovals(ApprovalOnlineStatus.pending);
    if (isProviderUser) {
      this.isProviderUser = true;
      return this.approvalService.getApprovals(undefined, user.providerId, user.id);
    }

    return this.approvalService.getApprovals();
  }
}
