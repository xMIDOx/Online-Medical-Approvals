import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';

import { ClaimPhoto } from './../../models/claim-photo.model';
import { OnlineEntryType } from './../../models/online-entry-type.enum';
import { ClaimPhotoService } from './../../services/claim-photo.service';


@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.css'],
})
export class TicketsListComponent implements OnInit {
  public tickets$ = new Observable<ClaimPhoto[]>();
  public dtOptions: DataTables.Settings = {};

  constructor(private claimPhotoService: ClaimPhotoService) {}

  ngOnInit(): void {
    this.getPendingTickets();
  }

  public getPendingTickets() {
    this.tickets$ = this.claimPhotoService.getClaimsPhotos(
      ApprovalOnlineStatus.pending,
      OnlineEntryType.Ticket
    );
  }
}
