import { Injectable } from '@angular/core';

import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private readonly approvalEndPoint = 'api/approval/';
  constructor(private http: GenericCRUDService) {}

  public CreateApproval(approval: any) {
    return this.http.Create(this.approvalEndPoint + 'create', approval);
  }
}
