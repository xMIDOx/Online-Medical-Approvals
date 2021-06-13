import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { Approval } from 'src/app/models/approval.model';

import { ApprovalItem } from './../../../models/approval-item.model';
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
  public approval: Approval = {
    id: 0,
    approvalDate: new Date(),
    claimNumber: 0,
    claimProviderId: 0,
    serviceProviderId: 0,
    claimProviderName: '',
    serviceProviderName: '',
    icdCodeId: 0,
    member: {
      id: 0,
      memberName: '',
      customerName: '',
      cardNumber: 0,
      isActive: false,
    },
    approvalItems: [],
  };
  public providers = new Observable<object>();
  public diagnosis = new Observable<object>();
  private queryObj: any = {};

  constructor(
    private lookupService: LookupsService,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {}

  public getProviders(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.providers = this.lookupService.getProviders(this.queryObj);
  }

  public getDiagnosis(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.diagnosis = this.lookupService.getDiagnosis(this.queryObj);
  }

  public getSelectedProvider(item: KeyValue) {
    if (item) this.approval.serviceProviderId = item.id;
  }

  public getSelectedDiagnosis(item: KeyValue) {
    if (item) this.approval.icdCodeId = item.id;
  }

  public getItems(items: ApprovalItem[]) {
    this.approval.approvalItems = items;
  }

  public getMemberInfo() {
    if (this.approval.member.cardNumber) {
      this.lookupService
        .getMember(this.approval.member.cardNumber)
        .subscribe((res) => {
          if (res) this.approval.member = res as Member;
          this.setStatusName();
        });
    }
  }

  public getClaimProvider() {
    if (this.approval.claimNumber) {
      this.lookupService
        .getProviderByClaimNum(this.approval.claimNumber)
        .subscribe((res: any) => {
          if (res) {
            this.approval.claimProviderId = res.id;
            this.approval.claimProviderName = res.name;
          }
        });
    }
  }

  private setStatusName() {
    if (this.approval.member.isActive)
      this.approval.member.statusName = 'Active';
    else this.approval.member.statusName = 'Stopped';
  }

  public setDate(date: any) {
    this.approval.approvalDate = date;
    console.log(typeof date, this.approval.approvalDate);
  }

  public onSubmit(form: NgForm) {
    console.log(form.value);
    if (!form.value) return;
    var approval: any = {};
    approval.ProviderId = this.approval.serviceProviderId;
    approval.PlanMemberId = this.approval.member.id;
    approval.CardNumber = this.approval.member.cardNumber;
    approval.ApprovalDate = this.approval.approvalDate;
    approval.ClaimNumber = this.approval.claimNumber;
    approval.ApprovalItems = this.approval.approvalItems;
    console.log(approval);
    if (!approval) return;
    // this.approvalService.CreateApproval(approval).subscribe();
  }
}
