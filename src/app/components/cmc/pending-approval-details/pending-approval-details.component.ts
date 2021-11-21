import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ApprovalItemCreate } from 'src/app/models/approval-item-create.model';
import { ClientApproval } from 'src/app/models/client-approval';
import { PlanBenefit } from 'src/app/models/plan-benefit.model';

import { PlanMasterBenefit } from '../../../models/plan-master-benefit.model';
import { ApprovalOnlineStatus } from './../../../models/approval-online-status.enum';
import { CeilingUtilization } from './../../../models/ceiling-utilization.model';
import { ItemStatus } from './../../../models/item-status.enum';
import { Member } from './../../../models/member.model';
import { PendingApprovalDetails } from './../../../models/pending-approval-details.model';
import { Roles } from './../../../models/user-roles.enum';
import { UserToken } from './../../../models/user-token.model';
import { ApprovalService } from './../../../services/approval.service';
import { AuthService } from './../../../services/auth.service';
import { LookupsService } from './../../../services/lookups.service';
import { PrintService } from './../../../services/print.service';

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
  public userRoles: string[] = [];
  public approvalsHistory$ = new Observable<ClientApproval[]>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private approvalService: ApprovalService,
    private lookupService: LookupsService,
    private authService: AuthService,
    private printService: PrintService
  ) {}

  ngOnInit(): void {
    const approvalId = this.route.snapshot.params['id'];
    this.getApprovalByIdAndRole(approvalId);
  }

  public getMemberApprovals(memberId: number) {
    this.approvalsHistory$ =
      this.approvalService.getMemberApprovalsHistory(memberId);
  }

  public onMasterBenefitChange(): void {
    this.resetCeiling();

    this.approval.masterBenefitId = this.masterBenefit.masterBenefitsId;
    this.ceiling.masterCeiling = this.masterBenefit.masterCeilingAmt;

    this.fetchPlanBenefits();

    if (this.masterBenefit.planId != 0) {
      this.getCeilingUtilization$().subscribe((res) => {
        this.ceiling.masterUtilization = res;
        this.ceiling.remainingMaster =
          this.ceiling.masterCeiling - this.ceiling.masterUtilization;
      });
    } else {
      // Get Pool Utilization.
    }
  }

  public onBenefitChange(): void {
    this.approval.benefitId = this.benefit.benefitId;
    this.approval.approvalCopaymentPer = this.benefit.coPaymentPer;
    this.ceiling.benefitCeiling = this.benefit.maxCeilingAmt;

    this.approval.approvalCopaymentAmt =
      this.approval.maxApprovalAmt == 0
        ? this.benefit.coPaymentPer * this.approval.approvalAmt
        : this.maxAmtCopayment();

      // this.approval.approvalCopaymentAmt = this.benefit.coPaymentPer * this.approval.approvalAmt;

    this.getCeilingUtilization$().subscribe((utili: number) => {
      this.ceiling.benefitUtilization = utili;
      this.ceiling.remainingBenefit =
        this.ceiling.benefitCeiling - this.ceiling.benefitUtilization;
      this.availableCeiling = this.getAvailableCeiling();
    });
  }

  public toggleItem(item: ApprovalItemCreate): void {
    item.status =
      item.status === ItemStatus.Rejected
        ? ItemStatus.Accepted
        : ItemStatus.Rejected;

    this.calculateApprovalAmt();

    if (this.approval.approvalCopaymentPer != 0) {
      this.approval.approvalCopaymentAmt =
        this.approval.maxApprovalAmt == 0
          ? this.benefit.coPaymentPer * this.approval.approvalAmt
          : this.maxAmtCopayment();
    }

  }

  public onSubmitApproval(onlineStatusId: number): void {
    if (onlineStatusId === this.onlineStatus.accepted)
      this.approval.onlineStatusId = this.onlineStatus.accepted;
    else if (onlineStatusId === this.onlineStatus.rejected)
      this.approval.onlineStatusId = this.onlineStatus.rejected;

    this.approvalService
      .updateApproval(this.approval)
      .subscribe((res) => this.router.navigate(['/pending-approvals']));
  }

  public maxAmtCopayment(): number {
    if(this.approval.maxApprovalAmt != 0)
      return  this.approval.approvalCopaymentAmt = this.benefit.coPaymentPer * this.approval.maxApprovalAmt;

      return  this.approval.approvalCopaymentAmt = this.benefit.coPaymentPer * this.approval.approvalAmt;
  }

  private fetchPlanBenefits(): void {
    this.benefits$ = this.lookupService.getPlanBenefits(
      this.masterBenefit.planId,
      this.masterBenefit.masterBenefitsId
    );
  }

  private getApprovalByIdAndRole(approvalId: number): void {
    combineLatest([
      this.authService.userToken$,
      this.approvalService.getApprovalById(approvalId),
    ])
      .pipe(
        take(1),
        switchMap((combined: [UserToken, PendingApprovalDetails]) => {
          this.userRoles = combined[0].roles;
          this.approval = combined[1];

          return this.lookupService.getMember(combined[1].cardNumber).pipe(
            take(1),
            switchMap((member: Member) => {
              this.member = member;
              this.ceiling.annualCeiling = member.annualCeilingAmt;
              this.setMemberStatus();
              if (this.isProviderUser()) return EMPTY;
              // Return Nothing if Provider User.
              else {
                this.masterBenefits$ = this.lookupService.getPlanMasterBenefits(
                  member.planId
                );
                return this.getCeilingUtilization$(); // Return Member Utilization If CMC Doctor
              }
            })
          );
        })
      )
      .subscribe((result) => {
        if (typeof result === 'number') {
          this.ceiling.annualUtilization = result;
          this.ceiling.remainingAnnual =
            this.ceiling.annualCeiling - this.ceiling.annualUtilization;
        }
      });
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

  private getCeilingUtilization$(): Observable<number> {
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

  private getAvailableCeiling(): number {
    // let remainingObj = { value1: 0, value2: 0, value3: 0 };
    // remainingObj.value1 = this.ceiling.remainingAnnual;
    // remainingObj.value2 = this.ceiling.remainingMaster;
    // remainingObj.value3 = this.ceiling.remainingBenefit;

    // return Math.min(
    //   ...Object.entries(remainingObj).map((o) => o[1])
    // );
    const obj = [];
    obj.push(this.ceiling.remainingAnnual);
    obj.push(this.ceiling.remainingMaster);
    obj.push(this.ceiling.remainingBenefit);

    return obj.reduce((a, b) => Math.min(a, b));
  }

  private resetCeiling(): void {
    this.ceiling.benefitCeiling = 0;
    this.ceiling.benefitUtilization = 0;
    this.ceiling.remainingBenefit = 0;

    this.availableCeiling = 0;
  }

  public isCMC(): boolean {
    return this.userRoles.includes(Roles.CMCDoctor);
  }

  public isProviderUser(): boolean {
    return this.userRoles.includes(Roles.ProviderUser);
  }

  public showDispenseBtn(): boolean {
    return (
      this.isProviderUser() &&
      this.approval.onlineStatusId ===
        (this.onlineStatus.accepted || this.onlineStatus.rejected)
    );
  }

  public print(): void {
    this.printService.printDocument('approval', this.approval.id);
  }

  public onDispense(): void {
    this.approval.onlineStatusId = this.onlineStatus.dispensed;
    this.approvalService.updateApproval(this.approval).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/pending-approvals']);
    });
  }

  public isValidApproval(): boolean {
    return this.approval.approvalAmt > this.availableCeiling;
  }
}
