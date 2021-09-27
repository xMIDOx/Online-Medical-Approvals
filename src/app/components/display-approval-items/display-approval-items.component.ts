import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientApproval } from 'src/app/models/client-approval';

import { ClientApprovalItem } from './../../models/client-approval-item';

@Component({
  selector: 'app-display-approval-items',
  templateUrl: './display-approval-items.component.html',
  styleUrls: ['./display-approval-items.component.css']
})
export class DisplayApprovalItemsComponent implements OnInit {
  @Input() approvalItems = <ClientApprovalItem[]>{};

  constructor() { }

  ngOnInit(): void {
  }

}
