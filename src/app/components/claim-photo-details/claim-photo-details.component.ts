import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';
import { Roles } from 'src/app/models/user-roles.enum';
import { AuthService } from 'src/app/services/auth.service';

import { ClaimPhoto } from './../../models/claim-photo.model';
import { PhotoService } from './../../models/photo-Service';
import { UserToken } from './../../models/user-token.model';
import { ClaimPhotoService } from './../../services/claim-photo.service';
import { PrintService } from './../../services/print.service';

@Component({
  selector: 'app-claim-photo-details',
  templateUrl: './claim-photo-details.component.html',
  styleUrls: ['./claim-photo-details.component.css'],
})
export class ClaimPhotoDetailsComponent implements OnInit {
  public claimId = 0;
  public claimPhoto = <ClaimPhoto>{};
  public EStatus = ApprovalOnlineStatus;
  public ERoles = Roles;
  public userToken = <UserToken>{};

  constructor(
    private claimPhotoService: ClaimPhotoService,
    private printService: PrintService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.claimId = this.route.snapshot.params['id'];
    this.getClaimDetails();
  }

  public onClick(statusId: number) {
    this.claimPhoto.onlineStatusId = statusId;

    this.claimPhotoService
      .updateStatus(this.claimId, this.claimPhoto)
      .subscribe(() => {
        this.router.navigate(['/dashboard/claims/posted'], {
          queryParams: { statusId: this.EStatus.posted },
        });
      });
  }

  public print() {
    this.printService.printDocument('claim', this.claimId);
  }

  public showPrintBtn(): boolean {
    return this.userToken.roles.includes(this.ERoles.Receptionist);
  }

  public showActionBtns(): boolean {
    return this.userToken.roles.includes(this.ERoles.CMCDoctor);
  }

  public toggleStatus(claimService: PhotoService) {
    claimService.statusId =
      claimService.statusId === this.EStatus.rejected
        ? this.EStatus.accepted
        : this.EStatus.rejected;
  }

  private getClaimDetails(): void {
    this.authService.userToken$.pipe(
      switchMap((token) => {
        this.userToken = token;
        return this.claimPhotoService.getClaimPhoto(this.claimId)
      })
    ).subscribe(claim => this.claimPhoto = claim);
  }
}
