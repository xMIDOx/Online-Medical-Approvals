import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PendingApprovalDetails } from './../../../models/pending-approval-details.model';
import { PlanMasterBenefits } from './../../../models/plan-master-benefits.model';
import { ApprovalService } from './../../../services/approval.service';
import { LookupsService } from './../../../services/lookups.service';

@Component({
  selector: 'app-pending-approval-details',
  templateUrl: './pending-approval-details.component.html',
  styleUrls: ['./pending-approval-details.component.css'],
})
export class PendingApprovalDetailsComponent implements OnInit {
  public approval$ = new Observable<PendingApprovalDetails>();
  public planMasterBenefits$ = new Observable<PlanMasterBenefits[]>();
  public selectedMaster = <PlanMasterBenefits>{};
  private approvalId = 0;

  constructor(
    private route: ActivatedRoute,
    private approvalService: ApprovalService,
    private lookupService: LookupsService
  ) {}

  ngOnInit(): void {
    this.approvalId = this.route.snapshot.params['id'];
    this.approval$ = this.approvalService.getApprovalById(this.approvalId);
    this.planMasterBenefits$ = this.lookupService.getPlanMasterBenefits(2007);
  }

  getBenefits() {
     console.log(this.selectedMaster);
  }
}
