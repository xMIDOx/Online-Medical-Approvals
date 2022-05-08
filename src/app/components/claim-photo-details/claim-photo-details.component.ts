import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';
import { Roles } from 'src/app/models/user-roles.enum';
import { AuthService } from 'src/app/services/auth.service';

import { ClaimPhoto } from './../../models/claim-photo.model';
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
  public claimDetails$ = new Observable<ClaimPhoto>();
  public EStatus = ApprovalOnlineStatus;
  public ERoles = Roles;
  public userToken =  <UserToken>{};

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

  public showPrintBtn(): boolean {
    return this.userToken.roles.includes(this.ERoles.Receptionist);

  }

  public showActionBtns(): boolean {
    return this.userToken.roles.includes(this.ERoles.CMCDoctor);
  }

  private getClaimDetails(): void {
    this.claimDetails$ = this.authService.userToken$.pipe(
      take(1),
      switchMap(res => {
        this.userToken = res;
        return this.claimPhotoService.getClaimPhoto(this.claimId);
      })
    );
  }
}
