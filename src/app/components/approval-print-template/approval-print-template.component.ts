import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApprovalService } from 'src/app/services/approval.service';

import { ApprovalPrint } from './../../models/approval-print.model';
import { PrintService } from './../../services/print.service';

@Component({
  selector: 'app-approval-print-template',
  templateUrl: './approval-print-template.component.html',
  styleUrls: ['./approval-print-template.component.css'],
})
export class ApprovalPrintTemplateComponent implements OnInit {
  public approvalId: number = 0;
  public approval = new Observable<ApprovalPrint>();

  constructor(
    private route: ActivatedRoute,
    private printService: PrintService,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    this.approvalId = this.route.snapshot.params['id'];
    this.approval = this.approvalService.getApprovalPrintData(this.approvalId);
  }

  public isLoaded(event: any) {
    if (event && event.target) this.printService.onDataReady();
  }
}
