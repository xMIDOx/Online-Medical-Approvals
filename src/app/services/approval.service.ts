import { Injectable } from '@angular/core';

import { ApprovalDisplay } from '../models/approval-display.model';
import { ApprovalCreate } from './../models/approval-create.model';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private readonly approvalEndPoint = 'api/approval/';
  private approvalCreate = <ApprovalCreate>{};
  constructor(private http: GenericCRUDService) {}

  public CreateApproval(approval: ApprovalDisplay) {
    this.getApprovalObject(approval);
    console.log(this.approvalCreate);
    // return this.http.Create(
    //   this.approvalEndPoint + 'create',
    //   this.approvalCreate
    // );
  }

  private getApprovalObject(approvalDisplay: ApprovalDisplay) {
    this.approvalCreate.providerId = approvalDisplay.serviceProviderId;
    this.approvalCreate.planMemberId = approvalDisplay.planMemberId;
    this.approvalCreate.customerId = approvalDisplay.customerId;
    this.approvalCreate.cardNumber = approvalDisplay.cardNumber;
    this.approvalCreate.approvalDate = approvalDisplay.approvalDate;
    this.approvalCreate.claimNumber = approvalDisplay.claimNumber;
    this.approvalCreate.ICDCode = approvalDisplay.ICDCode;
    this.approvalCreate.approvalNumber = this.getApprovalNumber();
    this.approvalCreate.approvalAmt = 0;
    this.approvalCreate.approvalCopaymentPer = 0;
    this.approvalCreate.approvalCopaymentAmt = 0;
    this.approvalCreate.approvalType = 3;
    this.approvalCreate.masterBenefitId = 0;
    this.approvalCreate.benefitId = 0;
    this.approvalCreate.issuedBy = 0;
    this.approvalCreate.internalNotes = '';
    this.approvalCreate.approvalItems = approvalDisplay.approvalItems;
  }

  private getApprovalNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
