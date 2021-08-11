import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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
  private onlineStatus = ApprovalOnlineStatus;
  public isProviderUser = false;
  constructor(
    private approvalService: ApprovalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPendingApprovalsBasedOnUserRole();
  }

  private getPendingApprovalsBasedOnUserRole(): void {
    combineLatest([this.authService.userToken$, this.authService.getUser()])
      .pipe(
        take(1),
        map((combined: [UserToken, User]) => {
          const isCMC = combined[0].roles.includes(Roles.CMCDoctor);
          const isProviderUser = combined[0].roles.includes(Roles.ProviderUser);
          if (isCMC) {
            return this.approvalService
            .getApprovals(this.onlineStatus.pending, 0);
          }
          else if (isProviderUser) {
            this.isProviderUser = true;
            return this.approvalService
            .getApprovals(0, combined[1].providerId, combined[1].id);
          }
          return this.approvalService.getApprovals(0, 0);
        })
      )
      .subscribe((res) => (this.pendingApprovals$ = res));
  }
}
