import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';

import { ClaimPhoto } from './../../models/claim-photo.model';
import { ClaimPhotoService } from './../../services/claim-photo.service';
import { PrintService } from './../../services/print.service';

@Component({
  selector: 'app-claim-photo-details',
  templateUrl: './claim-photo-details.component.html',
  styleUrls: ['./claim-photo-details.component.css'],
})
export class ClaimPhotoDetailsComponent implements OnInit {
  public claimId = 0;
  public claimDetails$ = new Observable<ClaimPhoto>();
  public EStatus = ApprovalOnlineStatus;

  constructor(
    private claimPhotoService: ClaimPhotoService,
    private printService: PrintService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.claimId = this.route.snapshot.params['id'];
    this.getClaimDetails();
  }

  public onClick(statusId: number) {
    this.claimPhotoService
      .updateStatus(this.claimId, statusId)
      .subscribe(() => {
        this.router.navigate(['/dashboard/claims/posted'], {
          queryParams: { statusId: this.EStatus.posted },
        });
      });
  }

  public print() {
    this.printService.printDocument('claim', this.claimId);
  }

  public isAllowedPrint(statusId: number ) {
    return
  }

  private getClaimDetails(): void {
    this.claimDetails$ = this.claimPhotoService.getClaimPhoto(this.claimId);
  }
}
