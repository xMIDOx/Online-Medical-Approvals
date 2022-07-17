import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
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
  @ViewChild('approvalForm', { static: false }) approvalForm!: NgForm;
  public approval = <ApprovalDisplay>{};
  public member: Partial<Member> = {};
  public provider = <Provider>{};
  public diagnostics$ = new Observable<object>();
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
    this.getProviderUser();
    this.approval.onlineStatusId = ApprovalOnlineStatus.pending;
  }

  public getMemberInfo(cardNumber: NgModel): void {
    if (cardNumber.errors) {
      this.member = {};
      return;
    }

    this.lookupService
      .getMemberByCardNum(this.approval.cardNumber)
      .pipe(take(1))
      .subscribe(
        (member: Member) => this.fetchMemberData(member),
        () => {
          this.member = {};
          this.approvalForm.controls.cardNumber.setErrors({ invalid: true });
          console.log('Member Info', this.member);
        }
      );
  }

  public checkClaimFormNum(): void {
    if (!this.approval.claimNumber) return;

    this.approvalService
      .checkClaimNumber(this.approval.claimNumber, this.provider.id)
      .pipe(
        tap((isValid) => {
          if (!isValid) {
            this.approvalForm.controls.claimNumber.setErrors({ invalid: true });
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

  public getDiagnosticsList(searchTerm: string): void {
    this.queryObj.searchTerm = searchTerm;
    this.loadingDiagnosis = true;

    this.diagnostics$ = this.lookupService
      .getDiagnosis(this.queryObj)
      .pipe(tap(() => (this.loadingDiagnosis = false)));
  }

  public selectedDiagnosis(diagnosis: KeyValue): void {
    if (diagnosis) this.approval.ICDCodeId = diagnosis.id;
  }

  public getItems(items: ApprovalItemDisplay[]): void {
    this.approval.approvalItems = items;
  }

  public onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log(this.approval.approvalItems);
      this.approvalService
        .createApproval(this.approval)
        .pipe(take(1))
        .subscribe(
          () => {
            this.notification.showSuccess('Approval Created Successfully.');
            this.router.navigate(['/pending-approvals']);
          },
          () => {
            this.notification.showError('Could Not Create Approval');
          }
        );
    } else this.notification.showError('Form not valid');
  }

  private getProviderUser(): void {
    this.authService
      .getAuthProviderUser()
      .pipe(take(1))
      .subscribe((providerUser: User) => {
        this.fetchProvideruserData(providerUser);
      });
  }

  private getProviderByCalimNum(): Observable<KeyValue> {
    return this.lookupService
      .getProviderByClaimNum(this.approval.claimNumber)
      .pipe(take(1));
  }

  private fetchMemberData(member: Member): void {
    this.member = member;
    this.member.statusName = member.isActive ? 'Active' : 'Stopped';
    this.approval.planMemberId = member.id;
    this.approval.customerId = member.customerId;
  }

  private fetchProvideruserData(providerUser: User): void {
    this.approval.serviceProviderId = providerUser.providerId;
    this.approval.issuedBy = providerUser.id;
    this.provider = providerUser.provider;
  }
}
