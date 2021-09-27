import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientApproval } from 'src/app/models/client-approval';

@Component({
  selector: 'app-display-approvals-list',
  templateUrl: './display-approvals-list.component.html',
  styleUrls: ['./display-approvals-list.component.css'],
})
export class DisplayApprovalsListComponent implements OnInit, OnChanges {
  @Input() approvals$ = new Observable<ClientApproval[]>();
  public errorObject!: HttpErrorResponse;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.approvals$.pipe(
      catchError((err: HttpErrorResponse) => {
        this.errorObject = err;
        return throwError(err);
      })
    );
  }
}
