import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ProviderCategories } from 'src/app/models/provider-category.enum';

import { ApprovalItemDisplay } from '../../../models/approval-item-display.model';
import { BsModalComponent } from '../../bs-modal/bs-modal.component';
import { ItemStatus } from './../../../models/item-status.enum';
import { Provider } from './../../../models/provider.model';
import { ServicePrice } from './../../../models/service-price.model';
import { LookupsService } from './../../../services/lookups.service';
import { NgSelectComponent } from './../../ng-select/ng-select.component';

@Component({
  selector: 'app-create-approval-items',
  templateUrl: './create-approval-items.component.html',
  styleUrls: ['./create-approval-items.component.css'],
})
export class CreateApprovalItemsComponent implements OnInit {
  @Input() provider = <Provider>{};
  @ViewChild('childComp') childComp!: BsModalComponent;
  @ViewChild('ngSelectItems') ngSelectItems!: NgSelectComponent;
  @Output() getApprovalItems = new EventEmitter<ApprovalItemDisplay[]>();

  public priceList$ = new Observable<object>();
  public approvalItems: ApprovalItemDisplay[] = [];
  public approvalItem = <ApprovalItemDisplay>{};
  public providerCat = ProviderCategories;
  public loadingServices = false;
  private index = -1;
  private queryObj: any = {};

  constructor(private lookupService: LookupsService) {}

  ngOnInit(): void {
    this.approvalItem.status = ItemStatus.Accepted;
  }

  public getProviderPriceList(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;

    this.provider.providerCatId === this.providerCat.pharmacies
      ? this.getDrugsData()
      : this.getMedicalServices();
  }

  public getSelectedService(service: ServicePrice) {
    if (!service) return;

    this.provider.providerCatId === this.providerCat.pharmacies
      ? this.fetchSelectedDrug(service)
      : this.fetchSelectedService(service);
  }

  public onSubmit(form: NgForm) {
    const item = Object.assign({}, this.approvalItem);
    if (this.index === -1) this.approvalItems.push(item);
    else this.approvalItems[this.index] = item;
    this.getApprovalItems.emit(this.approvalItems);
    this.index = -1;
    form.reset();
    this.closeModal();
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

  private closeModal() {
    this.childComp.closeBtn.nativeElement.click();
  }

  public newSelection() {
    this.ngSelectItems.clear();
  }
}
