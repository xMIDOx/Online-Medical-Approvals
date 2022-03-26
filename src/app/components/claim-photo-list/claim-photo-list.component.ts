import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ClaimPhoto } from './../../models/claim-photo.model';
import { ClaimPhotoService } from './../../services/claim-photo.service';

@Component({
  selector: 'app-claim-photo-list',
  templateUrl: './claim-photo-list.component.html',
  styleUrls: ['./claim-photo-list.component.css'],
})
export class ClaimPhotoListComponent implements OnInit {
  @Input('claimStatus') claimStatusId = -1;
  public claimPhotos$ = new Observable<ClaimPhoto[]>();
  public dtOptions: DataTables.Settings = {};

  constructor(private claimPhotoService: ClaimPhotoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.claimStatusId == -1) {
      this.claimStatusId = this.route.snapshot.queryParams.statusId;
    }

    this.getClaims();
  }

  private getClaims() {
    this.claimPhotos$ = this.claimPhotoService.getClaimsPhotos();
  }

}
