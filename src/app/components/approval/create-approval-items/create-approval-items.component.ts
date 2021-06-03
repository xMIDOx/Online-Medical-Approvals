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
import { take } from 'rxjs/operators';
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
  public approvalItems: ApprovalItem[] = [];
  private index = -1;
  private provider: any;
  public servicesBuffers: KeyValue[] = [];
  public loading = false;
  public services: KeyValue[] = [];
  private bufferSize = 50;
  private numberOfItemsFromEndBeforeFetchingMore = 10;
  private queryObj: any = {};

  constructor(private lookups: LookupsService) {}

  ngOnInit(): void {
    this.getProviderType();
  }

  public trackItems(index: number, item: any) {
    item ? item.id : undefined;
  }

  Edit(item: ApprovalItem, i: number) {
    this.approvalItem = item;
    this.index = i;
  }

  remove(item: ApprovalItem) {
    const index = this.approvalItems.indexOf(item);
    this.approvalItems.splice(index, 1);
  }

  public onSubmit(form: NgForm) {
    if (this.index === -1) this.approvalItems.push(form.value);
    else this.approvalItems[this.index] = form.value;

    this.getApprovalItems.emit(this.approvalItems);
    this.index = -1;
    form.reset();
    this.closeModal();
  }

  private closeModal() {
    this.closeBtn.nativeElement.click();
  }

  public search(event: any) {
    if (event.term.length == 3) {
      this.queryObj.searchTerm = event.term;
      this.lookups
        .getMedicalServices(this.serviceProviderId, this.queryObj)
        .subscribe((res) => {
          this.services = res as KeyValue[];
          this.servicesBuffers = this.services.slice(0, this.bufferSize);
        });
    }
    if (event.term.length > 3) this.fetchMore();
  }

  private getServicesOrMedicines() {
    if (this.provider.providerCatId != 2) {
      this.lookups
        .getMedicalServices(this.serviceProviderId, this.queryObj)
        .subscribe((res) => {
          this.services = res as KeyValue[];
          this.servicesBuffers = this.services.slice(0, this.bufferSize);
        });
    } else {
      this.lookups.getMedicinesData(this.queryObj).subscribe((res) => {
        this.services = res as KeyValue[];
        this.servicesBuffers = this.services.slice(0, this.bufferSize);
      });
    }
  }

  private getProviderType(): any {
    this.lookups.getProviderById(this.serviceProviderId).subscribe((res) => {
      this.provider = res;
      console.log(this.provider);
    });
  }

  public onScroll(event: any) {
    if (this.loading || this.services.length <= this.servicesBuffers.length)
      return;

    if (
      event.end + this.numberOfItemsFromEndBeforeFetchingMore >=
      this.servicesBuffers.length
    )
      this.fetchMore();
  }

  public onScrollToEnd() {
    this.fetchMore();
  }

  private fetchMore() {
    const length = this.servicesBuffers.length;
    const more = this.services.slice(length, this.bufferSize + length);
    this.loading = true;
    this.servicesBuffers = this.servicesBuffers.concat(more);
    this.loading = false;
  }
}
