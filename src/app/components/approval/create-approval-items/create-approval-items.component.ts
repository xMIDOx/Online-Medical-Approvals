import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApprovalItemDisplay } from '../../../models/approval-item-display.model';
import { BsModalComponent } from '../../bs-modal/bs-modal.component';
import { ItemStatus } from './../../../models/item-status.enum';
import { Provider } from './../../../models/provider.model';
import { ServicePrice } from './../../../models/service-price.model';
import { LookupsService } from './../../../services/lookups.service';

@Component({
  selector: 'app-create-approval-items',
  templateUrl: './create-approval-items.component.html',
  styleUrls: ['./create-approval-items.component.css'],
})
export class CreateApprovalItemsComponent implements OnInit {
  @Input() provider = <Provider>{};
  @Output() getApprovalItems = new EventEmitter<ApprovalItemDisplay[]>();
  @ViewChild('childComp') childComp!: BsModalComponent;
  public priceList$ = new Observable<object>();
  public approvalItems: ApprovalItemDisplay[] = [];
  public approvalItem = <ApprovalItemDisplay>{};
  public loadingServices = false;
  private index = -1;
  private queryObj: any = {};

  constructor(private lookupService: LookupsService) {}

  ngOnInit(): void {
    // Default Item Status When Creating Items
    this.approvalItem.status = ItemStatus.Accepted;
  }

  public getProviderPriceList(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    (this.provider.providerCatId === 2) ? this.getDrugsData() : this.getMedicalServices();
  }

  public getSelectedService(service: ServicePrice) {
    if (!service) return;

    this.approvalItem.servicePrice = service.servicePrice;
    this.approvalItem.serviceName = service.name;
    if (this.provider.providerCatId === 2) {
      this.approvalItem.serviceId = service.id;
      this.approvalItem.isCovered = service.isCovered;
    } else {
      this.approvalItem.serviceId = service.serviceId;
      this.approvalItem.isCovered = true;
    }
    // this.approvalItem.serviceId = this.providerCatId === 2 ? service.id : service.serviceId;
  }

  public Edit(item: ApprovalItemDisplay, i: number) {
    this.approvalItem = item;
    this.index = i;
  }

  public cancelEdit(itemForm: NgForm) {
    this.approvalItem = <ApprovalItemDisplay>{};
    this.index = -1;
    itemForm.reset();
  }

  public remove(item: ApprovalItemDisplay) {
    const index = this.approvalItems.indexOf(item);
    this.approvalItems.splice(index, 1);
  }

  public onSubmit(form: NgForm) {
    this.approvalItem.status = ItemStatus.Accepted;
    const item = Object.assign({}, this.approvalItem);
    if (this.index === -1) this.approvalItems.push(item);
    else this.approvalItems[this.index] = item;
    this.getApprovalItems.emit(this.approvalItems);
    this.index = -1;
    form.reset();
    this.closeModal();
  }

  public trackItems(index: number, item: any) {
    item ? item.id : undefined;
  }

  private getMedicalServices() {
    this.loadingServices = true;
    this.priceList$ = this.lookupService
      .getMedicalServices(this.provider.id, this.queryObj)
      .pipe(tap(() => (this.loadingServices = false)));
  }

  private getDrugsData() {
    this.loadingServices = true;
    this.priceList$ = this.lookupService
      .getMedicinesData(this.queryObj)
      .pipe(tap(() => (this.loadingServices = false)));
  }

  private closeModal() {
    this.childComp.closeBtn.nativeElement.click();
  }
}
