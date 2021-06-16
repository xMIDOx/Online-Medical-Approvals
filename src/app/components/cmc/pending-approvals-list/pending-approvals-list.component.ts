import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PendingApproval } from './../../../models/pending-approval.model';
import { ApprovalService } from './../../../services/approval.service';

@Component({
  selector: 'app-pending-approvals-list',
  templateUrl: './pending-approvals-list.component.html',
  styleUrls: ['./pending-approvals-list.component.css']
})
export class PendingApprovalsListComponent implements OnInit {
  pendingApprovals$ = new Observable<PendingApproval[]>();
  constructor(private approvalService: ApprovalService) { }

  ngOnInit(): void {
    this.getPendingApprovals();
  }

  getPendingApprovals() {
    this.pendingApprovals$ = this.approvalService.getApprovals(1);
  }

}
