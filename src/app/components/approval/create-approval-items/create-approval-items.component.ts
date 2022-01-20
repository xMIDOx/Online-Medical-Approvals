import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProviderCategories } from 'src/app/models/provider-category.enum';

import { ApprovalItemDisplay } from './../../../models/approval-item-display.model';
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
  public priceList$ = new Observable<object>();
  public approvalItems: ApprovalItemDisplay[] = [];
  public approvalItem = <ApprovalItemDisplay>{};
  public providerCatEnum = ProviderCategories;
  public loadingServices = false;
  private queryObj: any = {};

  constructor(private lookupService: LookupsService) {}

  ngOnInit(): void {
    this.approvalItem.status = ItemStatus.Accepted;
  }

  public getProviderPriceList(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;

    this.provider.providerCatId === this.providerCatEnum.pharmacies
      ? this.getDrugsData()
      : this.getMedicalServices();
  }

  public getSelectedService(service: ServicePrice) {
    if (!service) return;

    this.provider.providerCatId === this.providerCatEnum.pharmacies
      ? this.fetchSelectedDrug(service)
      : this.fetchSelectedService(service);
  }

  public newSelection() {
    var isRowOpen = false;

    this.approvalItems.forEach((item) => {
      if (item.creationMode) isRowOpen = true;
    });

    if (!isRowOpen) {
      this.approvalItem.creationMode = true;
      this.approvalItems.push(this.approvalItem);
    }
  }

  public onEdit(item: ApprovalItemDisplay, index: number) {
    var _item = Object.assign({}, this.approvalItems[index]);

    this.approvalItem = _item;

    this.approvalItems.forEach((item) => {
      item.editMode = false;
      item.creationMode = false;
    });

    item.editMode = true;
  }

  public onCanelEdit(item: any): void {
    this.approvalItem = <ApprovalItemDisplay>{};
    item.editMode = !item.editMode;
  }

  public updateItem(item: any, index: any): void {
    item.creationMode = false;
    var _item = Object.assign({}, this.approvalItem);
    this.approvalItems[index] = _item;
    this.getApprovalItems.emit(this.approvalItems);
    this.resetObj(this.approvalItem);
  }

  public remove(item: ApprovalItemDisplay) {
    const index = this.approvalItems.indexOf(item);
    this.approvalItems.splice(index, 1);
    this.resetObj(this.approvalItem);
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

  private fetchSelectedDrug(drug: ServicePrice) {
    this.approvalItem.servicePrice = drug.servicePrice;
    this.approvalItem.serviceName = drug.name;
    this.approvalItem.serviceId = drug.id;
    this.approvalItem.isCovered = drug.isCovered;
  }

  private fetchSelectedService(service: ServicePrice) {
    this.approvalItem.servicePrice = service.servicePrice;
    this.approvalItem.serviceName = service.name;
    this.approvalItem.serviceId = service.serviceId;
    this.approvalItem.isCovered = true;
  }

  private resetObj(obj: any) {
    var props = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < props.length; i++) {
      delete obj[props[i]];
    }
  }
}
