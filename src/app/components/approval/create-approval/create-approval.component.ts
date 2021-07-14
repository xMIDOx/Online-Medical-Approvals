import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApprovalDisplay } from 'src/app/models/approval-display.model';
import { AuthService } from 'src/app/services/auth.service';

import { ApprovalItemDisplay } from '../../../models/approval-item-display.model';
import { ICDCodeDiagnosis } from './../../../models/ICDCode-Diagnosis.model';
import { KeyValue } from './../../../models/key-value.model';
import { Member } from './../../../models/member.model';
import { ApprovalService } from './../../../services/approval.service';
import { LookupsService } from './../../../services/lookups.service';

@Component({
  selector: 'app-create-approval',
  templateUrl: './create-approval.component.html',
  styleUrls: ['./create-approval.component.css'],
})
export class CreateApprovalComponent implements OnInit {
  public approval: ApprovalDisplay = {
    approvalDate: new Date(),
    cardNumber: 0,
    customerId: 0,
    planMemberId: 0,
    claimNumber: 0,
    claimProviderId: 0,
    serviceProviderId: 0,
    ICDCodeId: 0,
    onlineStatusId: 0,
    approvalItems: [],
  };
  public member = <Member>{};
  // public providers = new Observable<object>();
  public provider$ = new Observable<any>();
  public diagnosis = new Observable<object>();
  public claimProviderName = '';
  private queryObj: any = {};

  constructor(
    private lookupService: LookupsService,
    private approvalService: ApprovalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService
      .getUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.approval.serviceProviderId = user.providerId;
        this.provider$ = this.lookupService.getProviderById(user.providerId);
      });
  }

  // public getProviders(searchTerm: string): void {
  //   this.queryObj.searchTerm = searchTerm;
  //   this.providers = this.lookupService.getProviders(this.queryObj);
  // }

  public getDiagnosis(searchTerm: string): void {
    this.queryObj.searchTerm = searchTerm;
    this.diagnosis = this.lookupService.getDiagnosis(this.queryObj);
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
    if (this.approval.cardNumber) {
      this.lookupService
        .getMember(this.approval.cardNumber)
        .subscribe((res: Member) => {
          if (res) {
            this.member = res;
            this.approval.planMemberId = res.id;
            this.approval.customerId = res.customerId;
          }
          this.setStatusName();
        });
    }
  }

  public getClaimProvider(): void {
    if (this.approval.claimNumber) {
      this.lookupService
        .getProviderByClaimNum(this.approval.claimNumber)
        .subscribe((res: any) => {
          if (res) {
            this.approval.claimProviderId = res.id;
            this.claimProviderName = res.name;
          }
        });
    }
  }

  private setStatusName(): void {
    if (this.member.isActive) this.member.statusName = 'Active';
    else this.member.statusName = 'Stopped';
  }

  public setDate(date: any): void {
    this.approval.approvalDate = date;
    console.log(typeof date, this.approval.approvalDate);
  }

  public onSubmit(form: NgForm): void {
    if (form.valid)
      this.approvalService
        .createApproval(this.approval)
        .pipe(take(1))
        .subscribe((res) => this.router.navigate(['/pending-approvals']));

    form.reset();
  }
}
