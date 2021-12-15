import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { ApprovalDisplay } from 'src/app/models/approval-display.model';
import { KeyValue } from 'src/app/models/key-value.model';
import { Provider } from 'src/app/models/provider.model';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

import { ApprovalItemDisplay } from '../../../models/approval-item-display.model';
import { ApprovalOnlineStatus } from './../../../models/approval-online-status.enum';
import { Member } from './../../../models/member.model';
import { User } from './../../../models/user.model';
import { ApprovalService } from './../../../services/approval.service';
import { LookupsService } from './../../../services/lookups.service';

@Component({
  selector: 'app-create-approval',
  templateUrl: './create-approval.component.html',
  styleUrls: ['./create-approval.component.css'],
})
export class CreateApprovalComponent implements OnInit {
  public approval = <ApprovalDisplay>{};
  public member = <Member>{};
  public provider = <Provider>{};
  public diagnosis = new Observable<object>();
  public claimProviderName = '';
  public loadingDiagnosis = false;
  private queryObj: any = {};

  constructor(
    private lookupService: LookupsService,
    private approvalService: ApprovalService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAuthenticatedUser();
  }

  public getDiagnosis(searchTerm: string): void {
    this.queryObj.searchTerm = searchTerm;
    this.loadingDiagnosis = true;
    this.diagnosis = this.lookupService
      .getDiagnosis(this.queryObj)
      .pipe(tap(() => (this.loadingDiagnosis = false)));
  }

  public getSelectedProvider(item: KeyValue): void {
    if (item) this.approval.serviceProviderId = item.id;
  }

  public getSelectedDiagnosis(item: KeyValue): void {
    if (item) this.approval.ICDCodeId = item.id;
  }

  public getItems(items: ApprovalItemDisplay[]): void {
    this.approval.approvalItems = items;
  }

  public getMemberInfo(): void {
    if (!this.approval.cardNumber) return;

    this.lookupService
      .getMember(this.approval.cardNumber)
      .pipe(take(1))
      .subscribe((res: Member) => {
        if (res) {
          this.member = res;
          this.approval.planMemberId = res.id;
          this.approval.customerId = res.customerId;
          this.setStatusName();
        } else {
          this.member = <Member>{};
        }
      });
  }

  public getClaimProvider(): void {
    if (!this.approval.claimNumber) return;

    this.approvalService
      .checkClaimNumber(this.approval.claimNumber, this.provider.id)
      .pipe(
        tap((isValid) => {
          if (!isValid) {
            this.notification.showError('Claim Number is not valid.');
            this.claimProviderName = '';
          }
        }),
        switchMap((isValid) => {
          return isValid ? this.getProviderByCalimNum() : EMPTY;
        })
      )
      .pipe(take(1))
      .subscribe((provider: KeyValue) => {
        if (provider) {
          this.approval.claimProviderId = provider.id;
          this.claimProviderName = provider.name;
        }
      });
  }

  private getProviderByCalimNum(): Observable<KeyValue> {
    return this.lookupService
      .getProviderByClaimNum(this.approval.claimNumber)
      .pipe(take(1));
    // .subscribe((res: KeyValue) => {
    //   if (res) {
    //     this.approval.claimProviderId = res.id;
    //     this.claimProviderName = res.name;
    //   } else {
    //     this.approval.claimProviderId = 0;
    //     this.claimProviderName = '';
    //   }
    // });
  }

  public setDate(date: any): void {
    this.approval.approvalDate = date;
  }

  public onSubmit(form: NgForm): void {
    this.approval.onlineStatusId = ApprovalOnlineStatus.pending;

    if (form.valid)
      this.approvalService
        .createApproval(this.approval)
        .pipe(take(1))
        .subscribe(
          (res) => {
            this.notification.showSuccess('Approval Created Successfully.');
            this.router.navigate(['/pending-approvals']);
          },
          (error) => {
            this.notification.showError('Could Not Create Approval');
          }
        );
  }

  private getAuthenticatedUser(): void {
    this.authService
      .getUser()
      .pipe(
        take(1),
        switchMap((user: User) => {
          this.approval.serviceProviderId = user.providerId;
          this.approval.issuedBy = user.id;
          return this.lookupService.getProviderById(user.providerId);
        })
      )
      .pipe(take(1))
      .subscribe((provider: Provider) => {
        this.provider = provider;
      });
  }

  private setStatusName(): void {
    if (this.member.isActive) this.member.statusName = 'Active';
    else this.member.statusName = 'Stopped';
  }
}
