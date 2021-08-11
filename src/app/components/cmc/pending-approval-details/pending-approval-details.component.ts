import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { map, switchMap } from 'rxjs/operators';
import { ApprovalItemCreate } from 'src/app/models/approval-item-create.model';
import { PlanBenefit } from 'src/app/models/plan-benefit.model';

import { PlanMasterBenefit } from '../../../models/plan-master-benefit.model';
import { ApprovalOnlineStatus } from './../../../models/approval-online-status.enum';
import { CeilingUtilization } from './../../../models/ceiling-utilization.model';
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
  public ceiling = <CeilingUtilization>{};
  public onlineStatus = ApprovalOnlineStatus;
  public availableCeiling = 0;

  constructor(
    private route: ActivatedRoute,
    private approvalService: ApprovalService,
    private lookupService: LookupsService
  ) {}

  ngOnInit(): void {
    const approvalId = this.route.snapshot.params['id'];
    this.getApprovalById(approvalId);
  }

  public onMasterBenefitChange(): void {
    this.resetCeiling();

    this.approval.masterBenefitId = this.masterBenefit.masterBenefitsId;
    this.ceiling.masterCeiling = this.masterBenefit.masterCeilingAmt;

    this.fetchPlanBenefits();

    this.getUtilization().subscribe(
      (res) => {
        this.ceiling.masterUtilization = res;
        this.ceiling.remainingMaster = this.ceiling.masterCeiling - this.ceiling.masterUtilization;
      }
    );
  }

  public onBenefitChange(): void {
    this.approval.benefitId = this.benefit.benefitId;
    this.approval.approvalCopaymentPer = this.benefit.coPaymentPer;
    this.approval.approvalCopaymentAmt = this.benefit.coPaymentPer * this.approval.approvalAmt;
    this.ceiling.benefitCeiling = this.benefit.maxCeilingAmt;

    this.getUtilization().subscribe((res) => {
      this.ceiling.benefitUtilization = res;
      this.ceiling.remainingBenefit = this.ceiling.benefitCeiling - this.ceiling.benefitUtilization;
      this.getAvailableCeiling();
    });
  }

  public toggleItem(item: ApprovalItemCreate): void {
    item.status =
      item.status === ItemStatus.Rejected
        ? ItemStatus.Accepted
        : ItemStatus.Rejected;

    this.calculateApprovalAmt();

    if (this.approval.approvalCopaymentPer != 0)
        this.approval.approvalCopaymentAmt = this.benefit.coPaymentPer * this.approval.approvalAmt;
  }

  public onSubmitApproval(onlineStatusId: number) {
    if (onlineStatusId === this.onlineStatus.accepted)
      this.approval.onlineStatusId = this.onlineStatus.accepted;
    else if (onlineStatusId === this.onlineStatus.rejected)
      this.approval.onlineStatusId = this.onlineStatus.rejected;

    console.log(this.approval);
    this.approvalService.updateApproval(this.approval).subscribe(res => console.log(res));
  }

  private fetchPlanBenefits(): void {
    this.benefits$ = this.lookupService.getPlanBenefits(
      this.masterBenefit.planId,
      this.masterBenefit.masterBenefitsId
    );
  }

  private getApprovalById(approvalId: number) {
    this.approvalService
      .getApprovalById(approvalId)
      .pipe(
        take(1),
        switchMap((approval) => {
          this.approval = approval;
          return this.lookupService.getMember(approval.cardNumber).pipe(
            take(1),
            switchMap((member) => {
              this.member = member;
              this.ceiling.annualCeiling = member.annualCeilingAmt;
              this.masterBenefits$ = this.lookupService.getPlanMasterBenefits(member.planId);
              this.setMemberStatus();
              return this.getUtilization();
            })
          );
        })
      )
      .subscribe(
        (utilization) => {
          this.ceiling.annualUtilization = utilization;
          this.ceiling.remainingAnnual = this.ceiling.annualCeiling - this.ceiling.annualUtilization;
        }
      );
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

  private getUtilization(): Observable<number> {
    let queryParams: any = {};
    queryParams.memberId = this.member.id;
    queryParams.masterId = this.masterBenefit.id;
    queryParams.benefitId = this.benefit.id;

    return this.approvalService.getUtilization(queryParams).pipe(
      take(1),
      map((utilization) => {
        return utilization;
      })
    );
  }

  private getAvailableCeiling(): void {
    let remainingObj = {value1: 0, value2: 0, value3: 0};
    remainingObj.value1 = this.ceiling.remainingAnnual;
    remainingObj.value2 = this.ceiling.remainingMaster;
    remainingObj.value3 = this.ceiling.remainingBenefit;

    this.availableCeiling = Math.min(
      ...Object.entries(remainingObj).map((o) => o[1])
    );
  }

  private resetCeiling() {
    this.ceiling.benefitCeiling = 0;
    this.ceiling.benefitUtilization = 0;
    this.ceiling.remainingBenefit = 0;

    this.availableCeiling = 0;
  }
}
