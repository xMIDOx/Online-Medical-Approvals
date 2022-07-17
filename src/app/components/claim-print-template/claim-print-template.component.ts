import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';

import { ClaimPhoto } from './../../models/claim-photo.model';
import { ClaimPhotoService } from './../../services/claim-photo.service';
import { PrintService } from './../../services/print.service';

@Component({
  selector: 'app-claim-print-template',
  templateUrl: './claim-print-template.component.html',
  styleUrls: ['./claim-print-template.component.css'],
})
export class ClaimPrintTemplateComponent implements OnInit {
  public claimId = 0;
  public claimPhoto = <ClaimPhoto>{};
  public Estatus = ApprovalOnlineStatus;

  constructor(
    private claimPhotoService: ClaimPhotoService,
    private printService: PrintService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.claimId = this.route.snapshot.params['id'];
    this.getClaimPhoto(this.claimId);
  }

  private getClaimPhoto(id: number) {
    this.claimPhotoService.getClaimPhoto(id).subscribe(res => {
      this.claimPhoto = res;
      this.printService.onDataReady();
    })
  }


  private isLoaded(event: any) {
    if (event && event.target) this.printService.onDataReady();
  }

}
