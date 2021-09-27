import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApprovalItemDisplay } from '../../../models/approval-item-display.model';
import { BsModalComponent } from '../../bs-modal/bs-modal.component';
import { ItemStatus } from './../../../models/item-status.enum';
import { ServicePrice } from './../../../models/service-price.model';
import { LookupsService } from './../../../services/lookups.service';


@Component({
  selector: 'app-create-approval-items',
  templateUrl: './create-approval-items.component.html',
  styleUrls: ['./create-approval-items.component.css'],
})
export class CreateApprovalItemsComponent implements OnInit, OnChanges {
  @Input() serviceProviderId = 0;
  @Output() getApprovalItems = new EventEmitter<ApprovalItemDisplay[]>();
  @ViewChild('childComp') childComp!: BsModalComponent;
  public priceList$ = new Observable<object>();
  public approvalItems: ApprovalItemDisplay[] = [];
  public approvalItem = <ApprovalItemDisplay>{};
  public providerCatId = 0;
  public loadingServices = false;
  private index = -1;
  private queryObj: any = {};

  constructor(private lookupService: LookupsService) {}

  ngOnInit(): void {
    // Default Item Status When Creating Items
    this.approvalItem.status = ItemStatus.Accepted;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getProviderData();
    this.approvalItems.length = 0;
  }

  public getProviderPriceList(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    if (this.providerCatId === 2) this.getDrugsData();
    else this.getMedicalServices();
  }

  public getSelectedService(service: ServicePrice) {
    if (service) {
      this.approvalItem.serviceId = this.providerCatId === 2 ? service.id : service.serviceId;

      this.approvalItem.servicePrice = service.servicePrice;
      this.approvalItem.serviceName = service.name;
    }
  }

  public Edit(item: ApprovalItemDisplay, i: number) {
    this.approvalItem = item;
    this.index = i;
  }

  public cancelEdit(itemForm: NgForm) {
    this.approvalItem = <ApprovalItemDisplay>{}
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

  private getProviderData() {
    if (this.serviceProviderId) {
      this.lookupService
        .getProviderById(this.serviceProviderId)
        .subscribe((res: any) => (this.providerCatId = res.providerCatId));
    }
  }

  private getMedicalServices() {
    this.loadingServices =  true;
    this.priceList$ = this.lookupService.getMedicalServices(
      this.serviceProviderId,
      this.queryObj
    ).pipe(tap(() => this.loadingServices = false));
  }

  private getDrugsData() {
    this.loadingServices = true;
    this.priceList$ = this.lookupService.getMedicinesData(this.queryObj)
    .pipe(tap(() => this.loadingServices = false));
  }

  private closeModal() {
    this.childComp.closeBtn.nativeElement.click();
  }
}
