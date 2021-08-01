import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { Observable } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { switchMap } from 'rxjs/operators';
import { ApprovalItemCreate } from 'src/app/models/approval-item-create.model';
import { PlanBenefit } from 'src/app/models/plan-benefit.model';

import { PlanMasterBenefit } from '../../../models/plan-master-benefit.model';
import { ItemStatus } from './../../../models/item-status.enum';
import { Member } from './../../../models/member.model';
import { PendingApprovalDetails } from './../../../models/pending-approval-details.model';
import { ApprovalService } from './../../../services/approval.service';
import { LookupsService } from './../../../services/lookups.service';

@Component({
  selector: 'app-pending-approval-details',
  templateUrl: './pending-approval-details.component.html',
  styleUrls: ['./pending-approval-details.component.css'],
})
export class PendingApprovalDetailsComponent implements OnInit {
  public approval = <PendingApprovalDetails>{};
  public masterBenefits$ = new Observable<PlanMasterBenefit[]>();
  public benefits$ = new Observable<PlanBenefit[]>();

  public rejected = ItemStatus.Rejected;
  public accepted = ItemStatus.Accepted;
  public masterBenefit = <PlanMasterBenefit>{};
  public benefit = <PlanBenefit>{};
  public member = <Member>{};

  constructor(
    private route: ActivatedRoute,
    private approvalService: ApprovalService,
    private lookupService: LookupsService
  ) {}

  ngOnInit(): void {
    const approvalId = this.route.snapshot.params['id'];
    this.getApprovalById(approvalId);
  }

  public fetchPlanBenefits(): void {
    this.benefits$ = this.lookupService.getPlanBenefits(
      this.masterBenefit.planId,
      this.masterBenefit.masterBenefitsId
    );

    this.approval.masterBenefitId = this.masterBenefit.masterBenefitsId;
  }

  public calculateCopayment(): void {
    this.approval.benefitId = this.benefit.BenefitId;

    this.approval.approvalCopaymentPer = this.benefit.coPaymentPer;
    this.approval.approvalCopaymentAmt =
      this.benefit.coPaymentPer * this.approval.approvalAmt;
  }

  private getApprovalById(approvalId: number) {
    this.approvalService
      .getApprovalById(approvalId)
      .pipe(
        take(1),
        switchMap((approval: PendingApprovalDetails) => {
          this.approval = approval;

          return this.lookupService
            .getMember(approval.cardNumber)
            .pipe(take(1));
        })
      )
      .subscribe((member) => {
        this.member = member;
        this.masterBenefits$ = this.lookupService.getPlanMasterBenefits(member.planId);
        this.setMemberStatus();
      });
  }

  public toggleItem(item: ApprovalItemCreate): void {
    item.status =
      item.status === ItemStatus.Rejected
        ? ItemStatus.Accepted
        : ItemStatus.Rejected;

    this.calculateApprovalAmt();
    if (this.approval.approvalCopaymentPer != 0) this.calculateCopayment();
  }

  private calculateApprovalAmt(): void {
    this.approval.approvalAmt = 0;

    this.approval.approvalItems
      .filter((item) => item.status === ItemStatus.Accepted)
      .forEach((item) => {
        this.approval.approvalAmt += item.serviceTotalAmt;
      });
  }

  private setMemberStatus(): void {
    this.approval.memberStatus = this.member.isActive ? 'Active' : 'Stopped';
  }
}
