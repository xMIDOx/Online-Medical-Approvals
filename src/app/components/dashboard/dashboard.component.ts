import { Component, OnInit } from '@angular/core';
import { ApprovalOnlineStatus } from 'src/app/models/approval-online-status.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public onlineStatus = ApprovalOnlineStatus;
  constructor() { }

  ngOnInit(): void {
  }

}
