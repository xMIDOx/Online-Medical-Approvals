import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { KeyValue } from 'src/app/models/key-value.model';

import { ApprovalItem } from './../../../models/approval-item.model';
import { LookupsService } from './../../../services/lookups.service';

@Component({
  selector: 'app-create-approval-items',
  templateUrl: './create-approval-items.component.html',
  styleUrls: ['./create-approval-items.component.css'],
})
export class CreateApprovalItemsComponent implements OnInit {
  @Input() serviceProviderId = 0;
  @Output() getApprovalItems = new EventEmitter<ApprovalItem[]>();
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  public services: KeyValue[] = [];
  public approvalItems: ApprovalItem[] = [];
  public approvalItem: ApprovalItem = {
    id: 0,
    serviceId: 0,
    serviceName: '',
    quantity: 0,
    dosage: 0,
    dosageDays: 0,
    dosagePerDay: 0,
    dosageTime: 0,
  };
  private index = -1;
  private queryObj: any = {};

  constructor(private lookups: LookupsService) {}

  ngOnInit(): void {}

  public getMedicalServices(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.lookups
      .getMedicalServices(this.serviceProviderId, this.queryObj)
      .subscribe((res) => {
        this.services = res as KeyValue[];
      });
  }

  public getSelectedService(service: KeyValue) {
    this.approvalItem.serviceId = service.id;
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

  private closeModal() {
    this.closeBtn.nativeElement.click();
  }
}
