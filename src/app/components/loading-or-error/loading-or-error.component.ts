import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-or-error',
  templateUrl: './loading-or-error.component.html',
  styleUrls: ['./loading-or-error.component.css'],
})
export class LoadingOrErrorComponent implements OnInit {
  @Input()error!: HttpErrorResponse;
  @Input() message: string = '';
  constructor() {}

  ngOnInit(): void {}
}
