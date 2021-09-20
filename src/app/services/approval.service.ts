import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApprovalDisplay } from '../models/approval-display.model';
import { ApprovalCreate } from './../models/approval-create.model';
import { ApprovalItemCreate } from './../models/approval-item-create.model';
import { ApprovalItemDisplay } from './../models/approval-item-display.model';
import { PendingApprovalDetails } from './../models/pending-approval-details.model';
import { PendingApproval } from './../models/pending-approval.model';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private readonly approvalEndPoint = 'api/approval/';
  private approvalCreate = <ApprovalCreate>{};
  constructor(private http: GenericCRUDService) {}

  public createApproval(approval: ApprovalDisplay) {
    this.fetchApprovalCreateObject(approval);
    return this.http.Create(
      this.approvalEndPoint + 'CreateOrUpdate',
      this.approvalCreate
    );
  }

  public updateApproval(approval: any) {
    return this.http.Create(
      this.approvalEndPoint + 'CreateOrUpdate',
      approval
    );
  }

  public getApprovals(
    onlineStatusId?: number,
    providerId?: number,
    userId?: string
  ): Observable<PendingApproval[]> {
    const queryParams = { onlineStatusId: onlineStatusId, providerId: providerId, userId };
    return this.http
      .Get(
        this.approvalEndPoint +
          'getapprovals?' +
          this.http.toQueryString(queryParams)
      )
      .pipe(map((res) => res as PendingApproval[]));
  }

  public getApprovalById(id: number): Observable<PendingApprovalDetails> {
    return this.http
      .Get(this.approvalEndPoint + 'getapprovalbyid?id=' + id)
      .pipe(map((res) => res as PendingApprovalDetails));
  }

  public getUtilization(obj: any): Observable<number> {
    return this.http
      .Get(
        this.approvalEndPoint + 'getUtilization?' + this.http.toQueryString(obj)
      )
      .pipe(map((res) => res as number));
  }

  private fetchApprovalCreateObject(approvalDisplay: ApprovalDisplay) {
    this.approvalCreate.id = approvalDisplay.id;
    this.approvalCreate.providerId = approvalDisplay.serviceProviderId;
    this.approvalCreate.planMemberId = approvalDisplay.planMemberId;
    this.approvalCreate.customerId = approvalDisplay.customerId;
    this.approvalCreate.cardNumber = approvalDisplay.cardNumber;
    this.approvalCreate.approvalDate = approvalDisplay.approvalDate;
    this.approvalCreate.claimNumber = approvalDisplay.claimNumber;
    this.approvalCreate.ICDCodeId = approvalDisplay.ICDCodeId;
    this.approvalCreate.issuedBy = approvalDisplay.issuedBy;
    this.approvalCreate.printedNotes = approvalDisplay.printedNotes;
    this.approvalCreate.onlineStatusId = approvalDisplay.onlineStatusId;
    this.approvalCreate.approvalNumber = this.getApprovalNumber();
    this.approvalCreate.approvalType = 3;

    this.fetchItemsCreateObject(approvalDisplay.approvalItems);
    this.calculateApprovalAmt(this.approvalCreate);
  }

  private fetchItemsCreateObject(itemsDisplay: ApprovalItemDisplay[]) {
    this.approvalCreate.approvalItems = [];

    itemsDisplay.forEach((item) => {
      let itemCreate = <ApprovalItemCreate>{};

      itemCreate.serviceId = item.serviceId;
      itemCreate.serviceName = item.serviceName;
      itemCreate.serviceQnt = item.quantity;
      itemCreate.serviceUnitAmt = item.servicePrice;
      itemCreate.dosage = item.dosage;
      itemCreate.dosageDays = item.dosageDays;
      itemCreate.dosagePerDay = item.dosagePerDay;
      itemCreate.dosageTime = item.dosageTime;
      itemCreate.status = item.status;

      this.approvalCreate.approvalItems.push(itemCreate);
    });
  }

  private calculateApprovalAmt(approvalCreate: ApprovalCreate) {
    let approvalAmt = 0;

    approvalCreate.approvalItems.forEach((item) => {
      item.serviceTotalAmt = item.serviceQnt * item.serviceUnitAmt;
      approvalAmt += item.serviceTotalAmt;
    });

    approvalCreate.approvalAmt = approvalAmt;
  }

  private getApprovalNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
