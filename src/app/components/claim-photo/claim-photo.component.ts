import { Component, OnInit } from '@angular/core';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';

import { environment } from './../../../environments/environment';
import { OnlineEntryType } from './../../models/online-entry-type.enum';
import { ClaimPhotoService } from './../../services/claim-photo.service';

@Component({
  selector: 'app-claim-photo',
  templateUrl: './claim-photo.component.html',
  styleUrls: ['./claim-photo.component.css'],
})
export class ClaimPhotoComponent implements OnInit {
  public baseUrl = environment.urlAddress;
  public photos: any;
  constructor(private claimPhotoService: ClaimPhotoService) {}

  ngOnInit(): void {
    this.claimPhotoService
      .getClaimsPhotos(ApprovalOnlineStatus.pending, OnlineEntryType.Photo)
      .subscribe((res) => (this.photos = res));
  }
}
