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
import { KeyValue } from 'src/app/models/key-value.model';

import { ApprovalItem } from './../../../models/approval-item.model';
import { LookupsService } from './../../../services/lookups.service';

@Component({
  selector: 'app-create-approval-items',
  templateUrl: './create-approval-items.component.html',
  styleUrls: ['./create-approval-items.component.css'],
})
export class CreateApprovalItemsComponent implements OnInit, OnChanges {
  @Input() serviceProviderId = 0;
  @Output() getApprovalItems = new EventEmitter<ApprovalItem[]>();
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  public priceList = new Observable<object>();
  public approvalItems: ApprovalItem[] = [];
  public approvalItem = <ApprovalItem>{};
  public providerCatId = 0;
  private index = -1;
  private queryObj: any = {};

  constructor(private lookupService: LookupsService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getProviderData();
  }

  public getProviderPriceList(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    if (this.providerCatId === 2) this.getDrugsData();
    else this.getMedicalServices();
  }

  public getSelectedService(service: KeyValue) {
    if (service) this.approvalItem.serviceId = service.id;
  }

  public Edit(item: ApprovalItem, i: number) {
    this.approvalItem = item;
    this.index = i;
  }

  public remove(item: ApprovalItem) {
    const index = this.approvalItems.indexOf(item);
    this.approvalItems.splice(index, 1);
  }

  public onSubmit(form: NgForm) {
    this.approvalItem.serviceId = form.value.ngSelect.id;
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
    this.priceList = this.lookupService.getMedicalServices(
      this.serviceProviderId,
      this.queryObj
    );
  }

  private getDrugsData() {
    this.priceList = this.lookupService.getMedicinesData(this.queryObj);
  }

  private closeModal() {
    this.closeBtn.nativeElement.click();
  }
}
